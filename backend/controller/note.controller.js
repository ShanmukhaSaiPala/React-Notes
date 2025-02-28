import Note from "../models/note.model.js";

export const addNote = async (req, res) => {
  const { title, content, tags } = req.body;

  const { id } = req.user;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required.",
    });
  }

  if (!content) {
    return res.status(400).json({
      success: false,
      message: "Content is required.",
    });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: id,
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      note,
    });
  } catch (error) {
    console.log(`Error in Add Note Controller: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const editNote = async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found.",
    });
  }

  if (req.user.id !== note.userId) {
    return res.status(401).json({
      success: false,
      message: "You can only update your own note!.",
    });
  }

  const { title, content, tags, isPinned } = req.body;

  if (!title && !content && !tags) {
    return res.status(404).json({
      success: false,
      message: "No changes provided.",
    });
  }

  try {
    if (title) {
      note.title = title;
    }

    if (content) {
      note.content = content;
    }

    if (tags) {
      note.tags = tags;
    }

    if (isPinned) {
      note.isPinned = isPinned;
    }

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.log(`Error in Edit Note Controller: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllNotes = async (req, res) => {
  const userId = req.user.id;

  try {
    const notes = await Note.find({ userId: userId }).sort({ isPinned: -1 });

    res.status(200).json({
      success: true,
      message: "All notes retrived successfully",
      notes,
    });
  } catch (error) {
    console.log(`Error in Get All Notes Controller: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteNote = async (req, res) => {
  const noteId = req.params.noteId;

  const note = await Note.findOne({ _id: noteId, userId: req.user.id });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found.",
    });
  }

  try {
    await Note.deleteOne({ _id: noteId, userId: req.user.id });

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.log(`Error in Delete Note Controller: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateNotePinned = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    if (req.user.id !== note.userId) {
      return res.status(404).json({
        success: false,
        message: "You can only update your own note!.",
      });
    }

    const { isPinned } = req.body;

    note.isPinned = isPinned;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.log(`Error in Update Note Pinned Controller: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const searchNote = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  try {
    const matchingNotes = await Note.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Notes matching the search query retrieved successfully",
      notes: matchingNotes,
    });
  } catch (error) {
    console.log(`Error in Search Note Controller: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
