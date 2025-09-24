
import { Question, Cosmetic, McLines } from './types';

export const PRIZE_MONEY = [
    200000, 400000, 600000, 1000000, 2000000,      // Questions 1-5
    3000000, 6000000, 10000000, 14000000, 22000000, // Questions 6-10
    30000000, 40000000, 60000000, 85000000, 150000000 // Questions 11-15
].reverse();

export const SAFE_HAVENS = [0, 5, 10]; 

export const TOPICS = [
    "Lịch sử Việt Nam",
    "Lịch sử thế giới",
    "Địa lý",
    "Khoa học",
    "Văn học",
    "Văn hóa đại chúng",
    "Thể thao"
];

export const MOCK_QUESTIONS: Question[] = [
    {
        id: "mock-1",
        question: "Thủ đô của Việt Nam là gì?",
        choices: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng"],
        correctIndex: 0,
        explanation: "Hà Nội là thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam từ năm 1976.",
        difficulty: "easy",
        domain: "Địa lý"
    },
    {
        id: "mock-2",
        question: "Hành tinh nào gần Mặt Trời nhất?",
        choices: ["Sao Kim", "Sao Hỏa", "Sao Thủy", "Sao Mộc"],
        correctIndex: 2,
        explanation: "Sao Thủy là hành tinh nhỏ nhất và gần Mặt Trời nhất trong Hệ Mặt Trời.",
        difficulty: "easy",
        domain: "Khoa học"
    },
    {
        id: "mock-3",
        question: "Ai là tác giả của 'Truyện Kiều'?",
        choices: ["Hồ Xuân Hương", "Nguyễn Du", "Nguyễn Trãi", "Bà Huyện Thanh Quan"],
        correctIndex: 1,
        explanation: "Nguyễn Du là một nhà thơ, nhà văn hóa lớn của Việt Nam, tác giả của tác phẩm kinh điển 'Truyện Kiều'.",
        difficulty: "medium",
        domain: "Văn học"
    },
    {
        id: "mock-4",
        question: "Cuộc chiến tranh thế giới thứ hai kết thúc vào năm nào?",
        choices: ["1943", "1945", "1950", "1939"],
        correctIndex: 1,
        explanation: "Chiến tranh thế giới thứ hai chính thức kết thúc vào năm 1945 sau khi Nhật Bản đầu hàng quân Đồng minh.",
        difficulty: "medium",
        domain: "Lịch sử thế giới"
    },
    {
        id: "mock-5",
        question: "Dãy núi cao nhất thế giới là gì?",
        choices: ["Andes", "Alps", "Himalaya", "Rocky"],
        correctIndex: 2,
        explanation: "Dãy Himalaya ở châu Á là dãy núi cao nhất thế giới, chứa đỉnh Everest.",
        difficulty: "easy",
        domain: "Địa lý"
    }
];

export const COSMETICS: Cosmetic[] = [
    { id: 'avatar_default', type: 'avatar', name: 'Mặc định', levelReq: 1, asset: 'https://picsum.photos/seed/default/100' },
    { id: 'avatar_book', type: 'avatar', name: 'Mọt sách', levelReq: 2, asset: 'https://picsum.photos/seed/book/100' },
    { id: 'avatar_globe', type: 'avatar', name: 'Nhà địa lý', levelReq: 3, asset: 'https://picsum.photos/seed/globe/100' },
    { id: 'avatar_atom', type: 'avatar', name: 'Nhà khoa học', levelReq: 5, asset: 'https://picsum.photos/seed/atom/100' },
    { id: 'avatar_crown', type: 'avatar', name: 'Triệu phú', levelReq: 10, asset: 'https://picsum.photos/seed/crown/100' },
];

export const MC_LINES: McLines = {
  "intro": [
    "Xin chào mừng quý vị và các bạn đến với Ai là Triệu Phú – AI Edition!",
    "Chúng ta cùng bắt đầu hành trình chinh phục 15 câu hỏi hôm nay!",
    "Sẵn sàng chưa? Trò chơi bắt đầu!"
  ],
  "next_question": [
    "Đến với câu hỏi tiếp theo số {q}.",
    "Câu {q} đang đợi bạn. Hãy tập trung nhé!",
    "Tiếp tục nào! Câu {q}."
  ],
  "lifeline": [
    "Bạn muốn dùng quyền trợ giúp nào?",
    "Quyền trợ giúp đã được kích hoạt!",
    "Hy vọng trợ giúp sẽ mang lại đáp án đúng cho bạn."
  ],
  "correct": [
    "Chính xác! Xin chúc mừng!",
    "Tuyệt vời! Bạn đã có câu trả lời đúng!",
    "Quá xuất sắc! Tiếp tục đà này nhé!"
  ],
  "wrong": [
    "Rất tiếc, đây không phải là đáp án đúng.",
    "Đáng tiếc! Lựa chọn vừa rồi chưa chính xác.",
    "Không sao, chúng ta vẫn tiếp tục."
  ],
  "milestone": [
    "Chúc mừng! Bạn đã chạm mốc an toàn {money}.",
    "Tuyệt vời! Mốc {money} đã thuộc về bạn!",
    "Bạn đã bảo toàn {money}. Tiến lên!"
  ],
  "timer_warning": [
    "Còn 10 giây! Hãy đưa ra quyết định!",
    "Nhanh lên nhé, thời gian sắp hết!"
  ],
  "timeout": [
    "Hết giờ! Chúng ta sẽ phải dừng ở đây.",
    "Rất tiếc, đồng hồ đã điểm."
  ],
  "win": [
    "Xin chúc mừng! Bạn đã chinh phục toàn bộ 15 câu hỏi và trở thành triệu phú!",
    "Ngoạn mục! Một chiến thắng hoàn hảo!"
  ]
};

export const XP_PER_CORRECT_ANSWER = [
    10, 10, 10, 10, 20, // 1-5
    20, 20, 30, 30, 50, // 6-10 (Milestone bonus)
    50, 60, 70, 80, 100 // 11-15 (Milestone bonus)
];
export const LEVEL_UP_XP_THRESHOLD = (level: number) => 100 * level * 1.5;
