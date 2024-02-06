"use client"
// Add necessary types/interfaces as needed

import { useRef, useState, useEffect } from 'react';
import { FaAngleDown, FaCircleInfo, FaEye, FaX, FaDeleteLeft, FaWandMagicSparkles } from "react-icons/fa6";
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
// ... (imports remain unchanged)

interface Document {
  title: string;
  content: string;
}

const MarkdownEditor: React.FC = () => {
  function generateDocumentName(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
  
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return "Document_" + code;
  }

  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState<number>(0);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [currentlySaved, setCurrentlySaved] = useState<boolean>(false);

  useEffect(() => {
    // Load documents from localStorage on component mount
    const localStorageItem = localStorage.getItem('mditorDocs');
  
    // Check if the localStorage item exists and is not null
    let savedDocuments: Document[] = [];
  
    if (localStorageItem){
      savedDocuments = JSON.parse(localStorageItem);
    } else {
      const newDocument: Document = { title: generateDocumentName(), content: '# Welcome!' };
      savedDocuments.push(newDocument);
      setCurrentDocumentIndex(0);
      setCustomTitle(newDocument.title);
    }
  
    setDocuments(savedDocuments);
  
    // Set the latest document as the current document on page load
    if (savedDocuments.length > 0) {
      setCurrentDocumentIndex(savedDocuments.length - 1);
    }
  }, []);
  

  useEffect(() => {
    // Set the title according to the current document when the page reloads
    if (documents.length > 0) {
      setCustomTitle(documents[currentDocumentIndex].title);
    }
  }, [currentDocumentIndex, documents]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments];
      console.log("currentDocumentIndex:", currentDocumentIndex);
      console.log("updatedDocuments length:", updatedDocuments.length);
      
      updatedDocuments[currentDocumentIndex].content = event.target.value;
      return updatedDocuments;
    });
  };

  const [saveButtonText, setSaveButtonText] = useState<string>("Save");

  const handleSaveDocument = () => {
    if (customTitle.trim() === '') {
      alert('Please enter a title for the document.');
      return;
    }

    setDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments];
      updatedDocuments[currentDocumentIndex] = { title: customTitle, content: documents[currentDocumentIndex].content };
      return updatedDocuments;
    });

    // Save documents to localStorage
    localStorage.setItem('mditorDocs', JSON.stringify(documents));
    setCurrentlySaved(true);

    setSaveButtonText("Saved!");
    setTimeout(() => {
      setSaveButtonText("Save");
    }, 1500);
  };

  const handleCreateNewDocument = () => {
    const newDocument: Document = { title: generateDocumentName(), content: '' };
    setDocuments([...documents, newDocument]);
    setCurrentDocumentIndex(documents.length);
    setCustomTitle(newDocument.title);
  };

  const handleDocumentClick = (index: number) => {
    setCurrentDocumentIndex(index);
    setCustomTitle(documents[index].title);
  };

  const handleDeleteDocument = (index: number) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
  
    if (updatedDocuments.length === 0) {
      // If all documents are deleted, reset state to initial values
      const newDocument: Document = { title: generateDocumentName(), content: '# Welcome!' };
      updatedDocuments.push(newDocument);
      setCurrentDocumentIndex(0);
      setCustomTitle(newDocument.title);
    } else {
      // If not all documents are deleted, update state normally
      if (index === currentDocumentIndex) {
        // If the deleted document was the current document, reset to the first document
        setCurrentDocumentIndex(0);
      } else if (index < currentDocumentIndex) {
        // If the deleted document was before the current document, adjust currentDocumentIndex
        setCurrentDocumentIndex(currentDocumentIndex - 1);
      }
    }
  
    setDocuments(updatedDocuments);
  
    localStorage.setItem('mditorDocs', JSON.stringify(updatedDocuments));
  };

  const [syncScroll, setSyncScroll] = useState<boolean>(false);

  const ToggleScrollSync = () => {
    setSyncScroll(!syncScroll);
  };

  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
    if (syncScroll) {
      const { target } = event;
      const scrollTop = (target as HTMLTextAreaElement).scrollTop;
      setScrollPosition(scrollTop);
    }
  };

  useEffect(() => {
    const container1 = editorRef.current;
    const container2 = previewRef.current;

    if (container1 && container2) {
      container2.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  const [showGuide, setShowGuide] = useState<boolean>(false);

  const toggleShowGuide = () => {
    setShowGuide(!showGuide);
  };

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const toggleShowSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <header className="w-full px-4 py-3 fixed bg-gray-900 flex justify-between items-center">
        <div className="flex w-fit items-center">
          <h1 className="text-3xl text-teal-300">&#x270E;</h1>
          <h1 className="text-white text-teal-300 text-sm leading-tight ml-2">MDITOR<br />Markdown Editor</h1>
          <div className="w-fit ml-8">
            <p className="text-[12px] text-teal-300 font-mono leading-3 ml-[0.2]">Document Title</p>
            <input type="text" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} className="bg-transparent text-sm border-b border-teal-300 outline-none text-white w-64" />
          </div>
        </div>
        <div className="flex w-fit items-center">
          <button className="p-2 py-2 text-sm bg-gradient-to-r from-teal-500 to-purple-500 text-gray-900 rounded-md ml-2 text-white hover:bg-teal-400"> Create page</button>
          <button className="p-2 py-2 text-sm bg-teal-300 text-gray-900 rounded-md ml-2 hover:bg-teal-400" onClick={handleCreateNewDocument}> New Document</button>
          <button className="p-2 py-2 text-sm bg-teal-300 text-gray-900 rounded-md ml-2 hover:bg-teal-400" onClick={handleSaveDocument}>{saveButtonText}</button>
          <button className="p-2 py-0 text-white rounded-md ml-2 text-xl" onClick={toggleShowSidebar}>&#x2630;</button>
        </div>
      </header>
      <main className="w-full h-[95vh] pt-[64px] flex">
        <div className="w-2/4 h-full">
          <div className="bg-white w-full h-[6%] px-4 py-2 border-b border-slate-500 flex items-center">
            <div className="group" onClick={toggleShowGuide}><FaCircleInfo /></div>
            <p className="text-sm font-mono ml-2">Markdown</p>
          </div>
          <textarea onScroll={handleScroll} ref={editorRef} value={documents[currentDocumentIndex]?.content || ''} onChange={handleChange} className="w-full h-[94%] bg-zinc-200 p-4 outline-none font-mono"></textarea>
        </div>
        <div className="w-2/4 h-full border-l border-slate-500">
          <div className="bg-white w-full h-[6%] px-4 py-2 border-b border-slate-500 flex items-center">
            <div className="group"><FaEye /></div>
            <p className="text-sm font-mono ml-2">Result Preview</p>
          </div>
          <div ref={previewRef} className="w-full h-[94%] overflow-y-scroll font-sans-serif p-5">
            <ReactMarkdown className="w-full h-full markdown-preview">{documents[currentDocumentIndex]?.content || ''}</ReactMarkdown>
          </div>
        </div>
      </main>
      <div className="w-full h-[5vh] border-t border-slate-500 flex items-center justify-between px-4">
        <p className="text-sm text-slate-500 font-mono">v0.1.1 - Built by @KunHnao & <span className="underline font-mono">contributors</span>.</p>
        <div className="w-fit flex">
          <label htmlFor="autoscroll" className="text-sm"> Scroll Sync
            <input type="checkbox" name="autoscroll" id="autoscroll" className="ml-1 relative top-[1px]" onClick={ToggleScrollSync} />
          </label>
        </div>
      </div>
      {showSidebar ? (
        <section className="absolute top-0 right-0 w-[25vw] h-screen bg-gray-800 shadow-2xl py-4 px-8 ">
          <div className="flex justify-between items-center mb-5 ">
            <h1 className="text-xl text-teal-300">&#x2630; Menu</h1>
            <FaX className="text-sm text-red-500" onClick={toggleShowSidebar}/>
          </div>
          <div className="mb-5">
            <h2 className="text-md text-white border-b mb-2 border-gray-700">Saved Documents</h2>
            <ul>
              {documents.map((doc, index) => (
                <li key={index} className="text-sm px-2 border-l my-1 text-white font-light w-full bg-gray-900 py-1 hover:bg-teal-900 flex justify-between items-center cursor-pointer">
                  <p onClick={() => handleDocumentClick(index)}>{doc.title}</p>
                  <FaDeleteLeft className="hover:text-red-500 cursor-pointer" onClick={() => handleDeleteDocument(index)} />
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-5">
            <h2 className="text-md text-white border-b mb-2 border-gray-700">Public Pages</h2>
            
          </div>
        </section>
      ) : (<></>)}
    </>
  );
};

export default MarkdownEditor;
