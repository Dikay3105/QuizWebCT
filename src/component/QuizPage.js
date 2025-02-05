import React, { useState, useRef, useEffect } from "react";
import "./QuizPage.scss";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import SortingHatPopup from "./SortingHatPopup";

// Hàm xáo trộn mảng (Fisher-Yates shuffle)
const shuffleArray = (array) => {
    return array
        .map((item) => ({ item, sort: Math.random() })) // Gán số ngẫu nhiên
        .sort((a, b) => a.sort - b.sort) // Sắp xếp theo số ngẫu nhiên
        .map(({ item }) => item); // Lấy lại giá trị ban đầu
};

// Danh sách câu hỏi với keyword
const questions = [
    {
        question: "Khi gặp một hiện tượng lạ, bạn sẽ?",
        options: [
            { text: "Tìm hiểu nguyên lý khoa học và công thức để giải thích hiện tượng đó", type: "science" },
            { text: "Phân tích ảnh hưởng của hiện tượng đó đối với con người và xã hội", type: "social" },
        ],
    },
    {
        question: "Bạn thích dạng bài tập nào hơn?",
        options: [
            { text: "Giải toán, lập luận logic", type: "science" },
            { text: "Viết luận, trình bày quan điểm", type: "social" },
        ],
    },
    {
        question: "Bạn thích đọc sách thuộc thể loại nào hơn?",
        options: [
            { text: "Sách khoa học, nghiên cứu", type: "science" },
            { text: "Tiểu thuyết, sách xã hội học", type: "social" },
        ],
    },
    {
        question: "Bạn thích làm việc với nội dung nào hơn?",
        options: [
            { text: "Số liệu, công thức, nguyên lý khoa học", type: "science" },
            { text: "Ngôn từ, ý tưởng, nội dung sáng tạo", type: "social" },
        ],
    },
    {
        question: "Bạn thích cách làm việc nào hơn?",
        options: [
            { text: "Làm việc độc lập với công cụ và số liệu", type: "science" },
            { text: "Làm việc nhóm, giao tiếp và hỗ trợ người khác", type: "social" },
        ],
    },
];

const QuizPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const audioRef = useRef(null);
    const [resultMessage, setResultMessage] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showResultPopup, setShowResultPopup] = useState(false);
    const [showVideo, setShowVideo] = useState(true);
    const videoRef = useRef(null);
    const audioResultRef = useRef(null);
    const [audioSrc, setAudioSrc] = useState("");


    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Khi câu hỏi thay đổi, xáo trộn câu trả lời
    useEffect(() => {
        setShuffledOptions(shuffleArray(questions[currentQuestion].options));
    }, [currentQuestion]);

    useEffect(() => {
        if (showResultPopup && videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.log("Không thể tự động phát video:", error);
            });
        }
    }, [showResultPopup]);

    useEffect(() => {
        if (showResultPopup && showVideo && videoRef.current) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.log("Trình duyệt chặn tự động phát video:", error);
                });
            }
        }
    }, [showResultPopup, showVideo]);

    useEffect(() => {
        if (!showVideo && audioResultRef.current) {
            audioResultRef.current.play();
        }
    }, [showVideo]);


    const handleChooseAnswer = (answer) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion]: answer,
        }));
        setErrorMessage(""); // Xóa lỗi nếu đã chọn
    };

    const handleSelectQuestion = (index) => {
        setCurrentQuestion(index);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            setErrorMessage("Vui lòng trả lời tất cả câu hỏi trước khi nộp.");
            return;
        }

        let scienceCount = 0;
        let socialCount = 0;

        questions.forEach((question, index) => {
            const selectedAnswer = answers[index];
            const selectedOption = question.options.find((opt) => opt.text === selectedAnswer);
            if (selectedOption) {
                selectedOption.type === "science" ? scienceCount++ : socialCount++;
            }
        });

        let result = "";
        let audioPath = ""; // Đường dẫn audio phù hợp

        if (scienceCount > socialCount) {
            result = "Chúc mừng con, con thuộc khối Khoa học tự nhiên";
            audioPath = `${process.env.PUBLIC_URL}/KHTN.m4a`; // Audio cho khối khoa học tự nhiên
        } else if (socialCount > scienceCount) {
            result = "Chúc mừng con, con thuộc khối Khoa học xã hội";
            audioPath = `${process.env.PUBLIC_URL}/KHXH.m4a`; // Audio cho khối khoa học xã hội
        } else {
            result = "Bạn có sự cân bằng giữa khoa học và xã hội!";
            audioPath = `${process.env.PUBLIC_URL}/Balanced.m4a`; // Audio cho trường hợp cân bằng
        }

        setResultMessage(result);
        setAudioSrc(audioPath); // Lưu đường dẫn audio
        setShowResultPopup(true); // Hiển thị popup
    };



    return (
        <div className="quiz">
            <div className="header">
                <img src={`${process.env.PUBLIC_URL}/logoNH.png`} alt="Logo" className="logo" />
                <h1 className="site-title">Trường THPT Nguyễn Hiền</h1>
            </div>


            <div className="container">
                <div className="hat-container">
                    <img src={`${process.env.PUBLIC_URL}/hat.png`} alt="Hat" className="hat-image" />
                </div>
                <button className="music-control" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
                </button>
                <div className="content_title">
                    Chiếc nón phân loại
                </div>
                <div className="numbers">
                    {questions.map((_, index) => (
                        <span
                            key={index}
                            className={currentQuestion === index ? "selected" : ""}
                            onClick={() => handleSelectQuestion(index)}
                        >
                            {index + 1}
                        </span>
                    ))}
                </div>

                <div className="question">{questions[currentQuestion].question}</div>

                {shuffledOptions.map((option, index) => (
                    <div
                        key={index}
                        className={`option ${answers[currentQuestion] === option.text ? "selected" : ""}`}
                        onClick={() => handleChooseAnswer(option.text)}
                    >
                        {option.text}
                    </div>
                ))}

                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <div className="navigation-buttons">
                    <button onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                        Trước
                    </button>
                    {currentQuestion < questions.length - 1 ? (
                        <button onClick={handleNextQuestion}>TIếp</button>
                    ) : (
                        <button onClick={handleSubmit}>Hoàn thành</button>
                    )}
                </div>

                {showResultPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            {showVideo ? (
                                <video
                                    ref={videoRef}
                                    src={`${process.env.PUBLIC_URL}/hat.mp4`}
                                    className="result-video"
                                    autoPlay
                                    onEnded={() => setShowVideo(false)} // Khi kết thúc video, hiện kết quả
                                />
                            ) : (
                                <div className="result-message">
                                    <h2>Kết Quả</h2>
                                    <p>{resultMessage}</p>
                                    <button onClick={() => {
                                        setShowResultPopup(false);
                                        window.location.reload()
                                    }}>Đóng</button>

                                    {/* Phát file audio phù hợp với kết quả */}
                                    {audioSrc && <audio autoPlay src={audioSrc} />}
                                </div>
                            )}
                        </div>
                    </div>
                )}



                <audio ref={audioRef} loop>
                    <source src={`${process.env.PUBLIC_URL}/harry.mp3`} type="audio/mp3" />
                    Trình duyệt của bạn không hỗ trợ audio.
                </audio>
            </div>
        </div>
    );
};

export default QuizPage;
