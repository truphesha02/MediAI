import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hi! I'm MediAI, your AI health companion. You can ask me a health question, speak to me, or upload an image for educational information.",
    },
  ]);

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);


  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = async () => {
    const text = input.trim();

    if (!text && !selectedImage) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: text || "Please analyze this image.",
      image: selectedImage,
    };

    setMessages((previous) => [...previous, userMessage]);

    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const conversation = messages
        .filter((message) => message.text)
        .map((message) => ({
          role: message.sender === "user" ? "user" : "assistant",
          content: message.text,
        }));

      const response = await fetch(
        "http://127.0.0.1:5000/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: text || "Please analyze this image.",
            conversation: conversation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to get a response from MediAI."
        );
      }

      setMessages((previous) => [
        ...previous,

        {
          id: Date.now() + 1,
          sender: "ai",
          text: data.response,
        },
      ]);

    } catch (error) {
      console.error("AI CHAT ERROR:", error);

      setMessages((previous) => [
        ...previous,

        {
          id: Date.now() + 1,
          sender: "ai",
          text:
            "I'm sorry, I couldn't connect to the AI service right now. Please make sure the MediAI backend is running and try again.",
        },
      ]);

    } finally {
      setIsTyping(false);
    }
  };


  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };


  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);
  };


  // =====================================================
  // VOICE ASSISTANT
  // =====================================================

  const startVoiceAssistant = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );

      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();

      setIsListening(false);

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;


    recognition.onstart = () => {
      setIsListening(true);
    };


    recognition.onresult = (event) => {
      const spokenText =
        event.results[0][0].transcript;

      setInput((previous) => {
        if (previous.trim()) {
          return previous + " " + spokenText;
        }

        return spokenText;
      });
    };


    recognition.onerror = () => {
      setIsListening(false);
    };


    recognition.onend = () => {
      setIsListening(false);
    };


    recognitionRef.current = recognition;

    recognition.start();
  };


  // =====================================================
  // QUICK QUESTIONS
  // =====================================================

  const quickQuestions = [
    "I have a headache. What should I do?",
    "How can I improve my sleep?",
    "What should I eat when I have a fever?",
    "How much water should I drink?",
  ];


  const askQuickQuestion = (question) => {
    setInput(question);
  };


  // =====================================================
  // NEW CHAT
  // =====================================================

  const startNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        text: "Hi! I'm MediAI. How can I help you today?",
      },
    ]);

    setInput("");

    setSelectedImage(null);
  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* =================================================
          TOP NAVBAR
      ================================================= */}

      <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-5 sm:px-8 shrink-0">

        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/health-check")}
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition"
          >
            ←
          </button>


          <div className="flex items-center gap-2">

            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-lg">
              🩺
            </div>


            <div>

              <h1 className="font-bold text-slate-800">
                MediAI
              </h1>


              <div className="flex items-center gap-1.5">

                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />

                <span className="text-[11px] text-slate-400">
                  AI Health Assistant
                </span>

              </div>

            </div>

          </div>

        </div>


        <button
          onClick={startNewChat}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-blue-600 transition"
        >
          + New Chat
        </button>

      </header>


      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div className="flex-1 flex overflow-hidden">


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 p-5 flex-col shrink-0">

          <button
            onClick={startNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-blue-600 transition"
          >
            <span>＋</span>
            New conversation
          </button>


          <div className="mt-8">

            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2">
              MediAI tools
            </p>


            <div className="mt-3 space-y-1">

              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium">
                <span>🤖</span>
                AI Health Chat
              </div>


              <button
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-sm transition"
              >
                <span>🖼️</span>
                Image Analysis
              </button>


              <button
                onClick={startVoiceAssistant}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-sm transition"
              >
                <span>🎙️</span>
                Voice Assistant
              </button>

            </div>

          </div>


          <div className="mt-auto">

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">

              <p className="text-xs font-semibold text-slate-700">
                Health information
              </p>


              <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                MediAI provides educational information and does not replace
                professional medical advice.
              </p>

            </div>

          </div>

        </aside>


        {/* =================================================
            CHAT AREA
        ================================================= */}

        <main className="flex-1 flex flex-col min-w-0">


          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="flex-1 overflow-y-auto">

            <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">


              {/* WELCOME */}
              {messages.length === 1 && (

                <div className="mb-8">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-2xl shadow-lg">
                      🩺
                    </div>


                    <div>

                      <h2 className="text-2xl font-bold text-slate-800">
                        How can I help you?
                      </h2>


                      <p className="text-sm text-slate-400 mt-1">
                        Ask, speak, or upload an image.
                      </p>

                    </div>

                  </div>


                  {/* QUICK QUESTIONS */}

                  <div className="grid sm:grid-cols-2 gap-3 mt-7">

                    {quickQuestions.map((question) => (

                      <button
                        key={question}
                        onClick={() =>
                          askQuickQuestion(question)
                        }
                        className="text-left p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
                      >

                        <span className="text-sm text-slate-600">
                          {question}
                        </span>


                        <span className="block mt-2 text-xs text-blue-500">
                          Ask MediAI →
                        </span>

                      </button>

                    ))}

                  </div>

                </div>

              )}


              {/* CONVERSATION */}

              <div className="space-y-6">

                {messages.map((message) => (

                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`flex gap-3 max-w-[85%] ${
                        message.sender === "user"
                          ? "flex-row-reverse"
                          : ""
                      }`}
                    >

                      {/* AVATAR */}

                      <div
                        className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-sm ${
                          message.sender === "user"
                            ? "bg-slate-900 text-white"
                            : "bg-blue-50"
                        }`}
                      >
                        {message.sender === "user"
                          ? "You"
                          : "🩺"}
                      </div>


                      {/* MESSAGE */}

                      <div
                        className={`px-5 py-4 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-slate-900 text-white rounded-tr-md"
                            : "bg-white border border-slate-100 shadow-sm rounded-tl-md"
                        }`}
                      >

                        {message.image && (

                          <img
                            src={message.image}
                            alt="Uploaded health image"
                            className="w-full max-w-sm rounded-xl mb-3"
                          />

                        )}


                        <p
                          className={`text-sm leading-relaxed ${
                            message.sender === "user"
                              ? "text-slate-100"
                              : "text-slate-600"
                          }`}
                        >
                          {message.text}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}


                {/* TYPING INDICATOR */}

                {isTyping && (

                  <div className="flex items-start gap-3">

                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                      🩺
                    </div>


                    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-md px-5 py-4">

                      <div className="flex gap-1.5">

                        <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />

                        <span
                          className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                          style={{
                            animationDelay: "150ms",
                          }}
                        />

                        <span
                          className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                          style={{
                            animationDelay: "300ms",
                          }}
                        />

                      </div>

                    </div>

                  </div>

                )}


                <div ref={messagesEndRef} />

              </div>

            </div>

          </div>


          {/* =================================================
              INPUT AREA
          ================================================= */}

          <div className="bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-4 pb-5 px-5 sm:px-8">

            <div className="max-w-4xl mx-auto">


              {/* SELECTED IMAGE */}

              {selectedImage && (

                <div className="mb-3 flex items-center gap-3 bg-white border border-blue-100 rounded-2xl p-3 shadow-sm">

                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-14 h-14 object-cover rounded-xl"
                  />


                  <div className="flex-1">

                    <p className="text-sm font-medium text-slate-700">
                      Image ready for analysis
                    </p>


                    <p className="text-xs text-slate-400 mt-1">
                      Add a question or send the image.
                    </p>

                  </div>


                  <button
                    onClick={() => setSelectedImage(null)}
                    className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400"
                  >
                    ×
                  </button>

                </div>

              )}


              {/* INPUT BOX */}

              <div className="bg-white border border-slate-200 rounded-3xl shadow-lg shadow-slate-900/5 p-2">

                <textarea
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isListening
                      ? "Listening..."
                      : "Ask MediAI anything about your health..."
                  }
                  rows={2}
                  className="w-full resize-none outline-none border-none px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 bg-transparent"
                />


                <div className="flex items-center justify-between px-2 pb-1">


                  {/* LEFT BUTTONS */}

                  <div className="flex items-center gap-1">

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />


                    {/* IMAGE */}

                    <button
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      title="Upload image"
                      className="w-10 h-10 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 flex items-center justify-center transition"
                    >
                      📎
                    </button>


                    {/* VOICE */}

                    <button
                      onClick={startVoiceAssistant}
                      title="Voice assistant"
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                        isListening
                          ? "bg-red-50 text-red-500 animate-pulse"
                          : "hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                      }`}
                    >
                      🎙️
                    </button>

                  </div>


                  {/* SEND */}

                  <button
                    onClick={sendMessage}
                    disabled={
                      !input.trim() && !selectedImage
                    }
                    className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-slate-900 transition-all"
                  >
                    ↑
                  </button>

                </div>

              </div>


              <p className="text-center text-[11px] text-slate-400 mt-3">
                MediAI can make mistakes. For serious or emergency concerns,
                seek professional medical care.
              </p>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Chat;