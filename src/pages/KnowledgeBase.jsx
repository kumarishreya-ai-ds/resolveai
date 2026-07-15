import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Upload, Trash2, Database, Layers3, Search } from "lucide-react";
import { clearAuthToken, deleteKnowledgeDocument, getKnowledgeDocuments, uploadKnowledgeDocument } from "../services/api";

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await getKnowledgeDocuments();
      setDocuments(response?.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDocuments(); }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadKnowledgeDocument(formData);
      setMessage(`Uploaded ${response?.data?.data?.document?.name || file.name}`);
      setFile(null);
      await loadDocuments();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Unable to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteKnowledgeDocument(id);
    await loadDocuments();
  };

  return (
    <div className="min-h-screen bg-[#030712] px-3 py-3 text-white sm:px-4 lg:px-5 lg:py-4">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-7xl rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_0_80px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Knowledge Base</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">Document retrieval store</h1>
            </div>
            <Link to="/workspace" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"><ArrowLeft className="h-4 w-4" />Back</Link>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Upload Documents</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Add company knowledge</h2>
              </div>
              <div className="rounded-full border border-blue-400/20 bg-blue-500/10 p-2 text-blue-300"><Upload className="h-4 w-4" /></div>
            </div>
            <form onSubmit={handleUpload} className="mt-5 space-y-4">
              <label className="block rounded-[1.25rem] border border-dashed border-white/15 bg-slate-950/70 px-4 py-6 text-center">
                <input type="file" accept=".pdf,.docx,.txt,.md,.markdown" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                <p className="text-sm text-slate-300">{file ? file.name : "Choose PDF, DOCX, TXT, or Markdown"}</p>
              </label>
              <button type="submit" disabled={!file || uploading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60">{uploading ? "Uploading..." : "Upload Document"}</button>
              {message ? <p className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">{message}</p> : null}
            </form>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4"><p className="text-xs uppercase tracking-[0.24em] text-slate-400">Documents</p><p className="mt-2 text-2xl font-semibold text-white">{documents.length}</p></div>
              <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4"><p className="text-xs uppercase tracking-[0.24em] text-slate-400">Chunks</p><p className="mt-2 text-2xl font-semibold text-white">{documents.reduce((sum, doc) => sum + (doc.chunkCount || 0), 0)}</p></div>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Uploaded Files</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Indexed knowledge documents</h2>
              </div>
              <Database className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="mt-5 space-y-3">
              {loading ? <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-400">Loading documents...</div> : null}
              {!loading && documents.map((doc) => (
                <div key={doc.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-white"><FileText className="h-4 w-4 text-blue-300" /><span className="font-semibold">{doc.name}</span></div>
                      <p className="mt-2 text-sm text-slate-400">{doc.chunkCount || 0} chunks · {doc.embeddingCount || 0} embeddings</p>
                      <p className="mt-1 text-xs text-slate-500">Uploaded {new Date(doc.uploadedAt).toLocaleString()}</p>
                    </div>
                    <button onClick={() => handleDelete(doc.id)} className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
