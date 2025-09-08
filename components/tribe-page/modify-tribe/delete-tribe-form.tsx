// delete tribe prompt

export function DeleteTribePrompt({ tribeSerial, onDelete }: any) {
    return (
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Are you sure you want to delete this tribe?</h2>
            <p className="text-lg mb-4">This action will remove all the posts and members associated with your tribe.</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={onDelete}>Delete</button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md ml-4" onClick={() => {}}>Cancel</button>
        </div>
    )
}