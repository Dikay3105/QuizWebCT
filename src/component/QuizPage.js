import React, { useState, useRef, useEffect } from "react";
import "./QuizPage.scss";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

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
        const unansweredQuestions = questions.filter(
            (_, index) => !answers.hasOwnProperty(index)
        );

        if (unansweredQuestions.length > 0) {
            setErrorMessage("Vui lòng trả lời tất cả các câu hỏi trước khi nộp.");
            return;
        }

        let scienceCount = 0;
        let socialCount = 0;

        questions.forEach((question, index) => {
            const selectedAnswer = answers[index];
            const selectedOption = question.options.find((opt) => opt.text === selectedAnswer);
            if (selectedOption) {
                if (selectedOption.type === "science") {
                    scienceCount++;
                } else if (selectedOption.type === "social") {
                    socialCount++;
                }
            }
        });

        let resultMessage = "";
        if (scienceCount > socialCount) {
            resultMessage = "Bạn có tư duy khoa học nhiều hơn!";
        } else if (socialCount > scienceCount) {
            resultMessage = "Bạn có thiên hướng về xã hội nhiều hơn!";
        } else {
            resultMessage = "Bạn có sự cân bằng giữa khoa học và xã hội!";
        }

        alert(resultMessage);
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

                <audio ref={audioRef} loop>
                    <source src={`${process.env.PUBLIC_URL}/harry.mp3`} type="audio/mp3" />
                    Trình duyệt của bạn không hỗ trợ audio.
                </audio>
            </div>
        </div>
    );
};

export default QuizPage;
