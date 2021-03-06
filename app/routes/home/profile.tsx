import { useActionData, useLoaderData } from "@remix-run/react"
import { useEffect, useRef, useState } from "react"
import { LoaderFunction, ActionFunction, redirect, json } from "@remix-run/node";
import { FormField } from "~/components/FormField"
import { Modal } from "~/components/Modal"
import { SelectBox } from "~/components/SelectBox"
import { departments } from "~/utils/constants"
import { deleteUser, getUser, updateUser } from "~/utils/users.server"
import type { Department } from "@prisma/client";
import { validateName } from "~/utils/validator.server";
import { logout, requireUserId } from "~/utils/session.server";
import { ImageUploader } from "~/components/ImageUploader";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request)
    return json({ user })
}

export const action: ActionFunction = async ({ request }) => {
    const userId = await requireUserId(request);
   const form = await request.formData();
   // 1 Pulls out the form data points you need from the request object.

   let firstName = form.get('firstName')
   let lastName = form.get('lastName')
   let department = form.get('department')

   const action = form.get('_action')

    switch (action) {
        case 'save':
   // 2 Ensures each piece of data you care about is of the string data type.
   if (
      typeof firstName !== 'string'
      || typeof lastName !== 'string'
      || typeof department !== 'string'
   ) {
      return json({ error: `Invalid Form Data` }, { status: 400 });
   }

   // 3 Validates the data using the validateName function written previously.
   const errors = {
      firstName: validateName(firstName),
      lastName: validateName(lastName),
      department: validateName(department)
   }

   if (Object.values(errors).some(Boolean))
      return json({ errors, fields: { department, firstName, lastName } }, { status: 400 });

   // Update the user here...
   await updateUser(userId, {
    firstName,
    lastName,
    department: department as Department
  })
   // 4 Redirects to the /home route, closing the settings modal.

   return redirect('/home')

   case 'delete':
    // Perform delete function
    await deleteUser(userId)
    return logout(request)
   default:
    return json({ error: `Invalid Form Data` }, { status: 400 });
 }
}

export default function ProfileSettings() {
    const { user } = useLoaderData()
    const actionData = useActionData()
    const [formError, setFormError] = useState(actionData?.error || '')
    const firstLoad = useRef(true)

    // 2 Created a formData object in state that holds the form's values. 
    //   This defaults those values to the logged in user's existing profile data.
    const [formData, setFormData] = useState({
        firstName: actionData?.fields?.firstName || user?.profile?.firstName,
        lastName: actionData?.fields?.lastName || user?.profile?.lastName,
        department: actionData?.fields?.department || (user?.profile?.department || 'MARKETING'),
        profilePicture: user?.profile?.profilePicture || ''
        })

    useEffect(() => {
        if (!firstLoad.current) {
            setFormError('')
        }
    }, [formData])

    useEffect(() => {
        firstLoad.current = false
    }, [])

    // 3 Created a function that takes in an HTML change event and a field name as parameters.
    //   Those are used to update the formData state as input fields' values change in the component.
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData(form => ({ ...form, [field]: event.target.value }))
    }

    const handleFileUpload = async (file: File) => {
        let inputFormData = new FormData()
        inputFormData.append('profile-pic', file)
        const response = await fetch('/avatar', {
        method: 'POST',
        body: inputFormData
        })
        const { imageUrl } = await response.json()
        setFormData({
        ...formData,
        profilePicture: imageUrl
        })
    }

    // 4 Renders the basic layout of the form as well as the two input fields.
    return (
        <Modal isOpen={true} className="w-1/3">
            <div className="p-3">
                <h2 className="text-4xl font-semibold text-blue-600 text-center mb-4">Your Profile</h2>
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">
                    {formError}
                </div>
            <div className="flex">
                <div className="w-1/3">
                        <ImageUploader onChange={handleFileUpload} imageUrl={formData.profilePicture || ''}/>
                </div>
                <div className="flex-1">
                <form method="post" onSubmit={e => !confirm('Are you sure?') ? e.preventDefault() : true}>
                    <FormField
                        htmlFor="firstName"
                        label="First Name"
                        value={formData.firstName}
                        onChange={e => handleInputChange(e, 'firstName')}
                        error={actionData?.errors?.firstName}
                    />
                    <FormField
                        htmlFor="lastName"
                        label="Last Name"
                        value={formData.lastName}
                        onChange={e => handleInputChange(e, 'lastName')}
                        error={actionData?.errors?.lastName}
                    />
                    <SelectBox 
                        className="w-full rounded-xl px-3 py-2 text-gray-400" 
                        id="department" 
                        label="Department" 
                        name="department" 
                        options={departments} 
                        value={formData.department} 
                        onChange={e => handleInputChange(e, 'department')} 
                    />
                    <button name="_action" value="delete" className="rounded-xl w-full bg-red-300 font-semibold text-white mt-4 px-16 py-2 transition duration-300 ease-in-out hover:bg-red-400 hover:-translate-y-1">
                        Delete Account
                    </button>
                    <div className="w-full text-right mt-4">
                    <button className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-16 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                        name="_action" 
                        value="save"
                    >
                        Save
                        </button>
                    </div>
                </form>
            </div>
            </div>
            </div>
         </Modal>
 )
}