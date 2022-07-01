import React, { useRef, useState } from "react";

interface props {
    onChange: (file: File) => any,
    imageUrl?: string
}

export const ImageUploader = ({ onChange, imageUrl }: props) => {
    const [draggingOver, setDraggingOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const dropRef = useRef(null)

    // 1 A preventDefault function is defined to handle changes to the file input in the component.
    const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    // 2 A handleDrop function is defined to handle drop events on the file input in the component.
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        preventDefaults(e)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onChange(e.dataTransfer.files[0])
            e.dataTransfer.clearData()
        }
    }

    // 3 A handleChange function is defined to handle any change events on the file input in the component.
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            onChange(event.currentTarget.files[0])
        }
    }

    // 4 A div is rendered with various event handlers defined, allowing it to react to file drops, drag events and clicks. These are used to trigger image uploads and style changes that appear only when the element is receiving a drag event.
    return (
        <div ref={dropRef}
            className={`${draggingOver ? 'border-4 border-dashed border-yellow-300 border-rounded' : ''} group rounded-full relative w-24 h-24 flex justify-center items-center bg-gray-400 transition duration-300 ease-in-out hover:bg-gray-500 cursor-pointer`}
            style={{
                backgroundSize: "cover",
                ...(imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}),
            }}
            onDragEnter={() => setDraggingOver(true)}
            onDragLeave={() => setDraggingOver(false)}
            onDrag={preventDefaults}
            onDragStart={preventDefaults}
            onDragEnd={preventDefaults}
            onDragOver={preventDefaults}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            {
                imageUrl &&
                <div className="absolute w-full h-full bg-blue-400 opacity-50 rounded-full transition duration-300 ease-in-out group-hover:opacity-0" />
            }
            {
                <p className="font-extrabold text-4xl text-gray-200 cursor-pointer select-none transition duration-300 ease-in-out group-hover:opacity-0 pointer-events-none z-10">+</p>
            }
            <input type="file" ref={fileInputRef} onChange={handleChange} className="hidden" />
        </div>
    )
}