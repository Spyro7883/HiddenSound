"use client"
import React from "react"

interface PlaylistModalProps {
    onClose: () => void;
}


const PlaylistModal: React.FC<PlaylistModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <section className="relative flex flex-col space-evenly w-96 h-48 rounded-lg bg-slate-700 p-4 m-8 inset-0">
                <div>
                    Add new playlist
                </div>
                <button onClick={onClose} className="absolute top-4 right-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </section>
        </div>
    )

}

export default PlaylistModal;