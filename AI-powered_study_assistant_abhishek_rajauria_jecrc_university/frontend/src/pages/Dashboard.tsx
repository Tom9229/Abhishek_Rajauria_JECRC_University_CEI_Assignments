import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocuments, uploadDocument, deleteDocument } from '../services/api';
import { FileUp, FileText, Trash2, Loader2, Library } from 'lucide-react';
import { cn } from '../lib/utils';

export function Dashboard() {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadMutation.mutate(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadMutation.mutate(e.target.files[0]);
    }
  };

  const totalPages = documents.reduce((acc: number, doc: any) => acc + (doc.pages || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your study materials here.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Documents</h3>
            <Library className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">{documents.length}</div>
        </div>
        <div className="rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Pages</h3>
            <FileText className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">{totalPages}</div>
        </div>
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
          isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept=".pdf,.txt,.docx,.pptx" />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
            {uploadMutation.isPending ? <Loader2 className="w-8 h-8 animate-spin" /> : <FileUp className="w-8 h-8" />}
          </div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">
            {uploadMutation.isPending ? "Uploading..." : "Click to upload or drag and drop"}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">PDF, DOCX, PPTX, or TXT</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Documents</h2>
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : documents.length === 0 ? (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400 border rounded-xl border-dashed">No documents uploaded yet.</div>
        ) : (
          <div className="border rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-3 font-medium">Filename</th>
                  <th className="px-6 py-3 font-medium">Pages</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {documents.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-500" />
                      {doc.filename}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{doc.pages}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(doc.upload_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteMutation.mutate(doc.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
