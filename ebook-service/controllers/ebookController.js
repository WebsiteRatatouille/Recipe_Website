import Ebook from "../models/Ebook.js";

export const createEbook = async (req, res) => {
  try {
    const ebook = await Ebook.create(req.body);
    res.json(ebook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEbooks = async (req, res) => {
  try {
    const ebooks = await Ebook.find();
    res.json(ebooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEbookById = async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) return res.status(404).json({ message: "Ebook not found" });
    res.json(ebook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEbook = async (req, res) => {
  try {
    const updated = await Ebook.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Ebook not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEbook = async (req, res) => {
  try {
    const deleted = await Ebook.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Ebook not found" });
    res.json({ message: "Ebook deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEbookComments = async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id).populate(
      "comments.user",
      "username name"
    );
    if (!ebook) return res.status(404).json({ message: "Ebook not found" });
    res.status(200).json(ebook.comments || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addEbookComment = async (req, res) => {
  try {
    const { content, userId, userName } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ message: "Nội dung bình luận không được để trống" });
    }
    if (!userId) {
      return res.status(400).json({ message: "Thiếu thông tin người dùng" });
    }

    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) return res.status(404).json({ message: "Ebook not found" });

    ebook.comments.push({ user: userId, userName, content });

    await ebook.save();

    res.status(201).json({ message: "Đã thêm bình luận thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEbookComment = async (req, res) => {
  try {
    const { ebookId, commentId } = req.params;
    const { content, userId, isAdmin } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ message: "Nội dung bình luận không được để trống" });
    }

    const ebook = await Ebook.findById(ebookId);
    if (!ebook) {
      return res.status(404).json({ message: "Ebook not found" });
    }

    const comment = ebook.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      !userId ||
      (comment.user.toString() !== userId.toString() && !isAdmin)
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa bình luận này" });
    }

    comment.content = content;
    await ebook.save();
    return res.status(200).json({ message: "Đã sửa bình luận thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEbookComment = async (req, res) => {
  try {
    const { ebookId, commentId } = req.params;
    const { userId, isAdmin } = req.body;

    const ebook = await Ebook.findById(ebookId);
    if (!ebook) {
      return res.status(404).json({ message: "Ebook not found" });
    }

    const comment = ebook.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      !userId ||
      (comment.user.toString() !== userId.toString() && !isAdmin)
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa bình luận này" });
    }

    ebook.comments = ebook.comments.filter(
      (c) => c._id.toString() !== commentId.toString()
    );
    await ebook.save();

    return res.status(200).json({ message: "Đã xóa bình luận thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};