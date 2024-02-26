import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";
const ADMIN_PASSWORD = "ADMIN_PASSWORD";
export class UserManager {
    private quizManager;

    constructor() {
        this.quizManager = new QuizManager;
    }

    addUser(socket: Socket) {
        this.createHandlers(socket);
    }


    private createHandlers(socket: Socket) {
        socket.on("join", (data) => {

            let userId = this.quizManager.getQuiz(data.roomId)?.getUser(data.userId);
           
            if(!userId){
                userId = this.quizManager.addUser(data.roomId, data.name)
            }
            socket.emit("init", {
                userId,
                state: this.quizManager.getCurrentState(data.roomId)
            });
            socket.join(data.roomId);
        });
        socket.on("joinAdmin", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name)
            if (data.password != ADMIN_PASSWORD) {
                return;
            }
            socket.on("createQuiz", data => {
                this.quizManager.addQuiz(data.roomId);
            })

            socket.on("createproblem", data => {

                this.quizManager.addProblem(data.roomId, data.problem);
            })

            socket.on("next", data => {
                this.quizManager.next(data.roomId);
            })
        });
        socket.on("submit", (data) => {
            const userId = data.userId;
            const problemId = data.problemId;
            const submission = data.submission;
            if (submission != 0 && submission != 1 && submission != 2 && submission != 3) {
                console.error("issue while getting input", submission);
                return;
            }
           this.quizManager.submit(userId, data.roomId, problemId, submission);
        });
    }
}