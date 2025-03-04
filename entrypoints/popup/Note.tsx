import { useState, useEffect, act } from "react";

function Notes() {
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [highContrast, setHighContrast] = useState(false);
  //  console.log("Name : " + import.meta.env.WXT_NAME);
  //  console.log("Version : " + import.meta.env.WXT_VERSION);
  //  console.log("URL : " + import.meta.env.WXT_URL);
  // Load notes from localStorage on component mount

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem("notes");
      if (storedNotes) {
        const savedNotes = JSON.parse(storedNotes);
        console.log("Saved notes:", savedNotes); // ✅ Proper logging
        setNotes(savedNotes);
      } else {
        console.log("No notes found in localStorage.");
        setNotes([]); // ✅ Ensures state is initialized
      }
    } catch (error) {
      console.error("Error loading notes from localStorage:", error);
      setNotes([]); // ✅ Prevents app from breaking
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      updateNotes();
    }
  }, [notes]);

  const updateNotes = () => {
    console.log(notes);
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  const handleSaveNote = () => {
    if (noteInput.trim()) {
      setNotes((pre) => [...pre, noteInput]);
      setNoteInput("");
    }
  };

  const handleDeleteNote = (index: number) => {
    setNotes((prevNotes) => {
      if (prevNotes.length == 1)
        localStorage.setItem("notes", JSON.stringify([]));

      const updatedNotes = prevNotes.filter((_, i) => i !== index);
      console.log(updatedNotes);
      return [...updatedNotes];
    });
  };

  const copy = async () => {
    const response = await browser.runtime.sendMessage({
      action: "getSelectedText",
    });
    console.log("Response: ");
    console.log(response?.text ?? "No response received");
    try {
      if (response?.text) {
        alert("In");
        await navigator.clipboard.writeText(response?.text);
        alert("Text copied to clipboard!");
      } else {
        alert("No text selected!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Notes Saver</h2>
      <textarea
        value={noteInput}
        onChange={(e) => setNoteInput(e.target.value)}
        placeholder="Type your note here..."
        className="resize-none p-2 text-lg font-bold w-full h-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      ></textarea>
      <button
        onClick={handleSaveNote}
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md mt-3 w-24 hover:bg-cyan-500 transition"
      >
        Save
      </button>
      <button
        onClick={copy}
        className="ml-2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md mt-3 w-24 hover:bg-cyan-500 transition"
      >
        Copy
      </button>

      <ul className="list-none p-0 mt-4 space-y-2">
        {notes.map((note, index) => (
          <li
            key={index}
            className="bg-green-300 p-2 flex justify-between items-center rounded-md"
          >
            <span className="break-words flex-1 text-left">{note}</span>
            <button
              className="cursor-pointer bg-red-300 text-white px-2 py-1 rounded-md ml-2 w-12 hover:bg-red-600 transition"
              onClick={() => handleDeleteNote(index)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notes;
