import { IoManager } from "./managers/IoManager";
const { v4: uuidv4 } = require('uuid');

export type AllowedSubmmision = 0 | 1 | 2 | 3;
const PROBLEM_TIME_S = 20;

interface User {
    name: string;
    id: string;
    points: number;
    roomId:string
}
export interface Submission {
    problemId: string;
    userId: string;
    isCorrect: boolean;
    optionSelected: AllowedSubmmision;
}
interface Problem {
    id: string;
    title: string;
    description: string;
    image?: string;
    startTime: number;
    answer: AllowedSubmmision;
    option: {
        id: number;
        title: string;
    }[];
    submissions: Submission[]
}
export class Quiz {
    public roomId: string;
    private hasStarted: boolean;
    private problems: Problem[];
    private activeProblem: number;
    private users: User[];
    private currentState :"leaderboard"|"question"|"not_started"|"ended";

    constructor(roomId: string) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = "not_started"
    }

    debug() {
        console.log("----debug---")
        console.log(this.roomId)
        console.log(JSON.stringify(this.problems))
        console.log(this.users)
        console.log(this.currentState)
        console.log(this.activeProblem);
    }
    addProblem(problem: Problem) {
        this.problems.push(problem);
    }

    start() {
        this.hasStarted = true;
        this.setActiveProblem(this.problems[0]);
    }
    setActiveProblem(problem:Problem){
        this.currentState = "question";
        problem.startTime  = new Date().getTime();
        problem.submissions = [];
        IoManager.getIo().emit("problem", {
            problem
        })
        setTimeout(()=>{
            this.sendLeaderboard();
        },PROBLEM_TIME_S*1000);
    }
    sendLeaderboard(){
        this.currentState = "leaderboard";
        const leaderboard = this.getLeaderboard();
        IoManager.getIo().to(this.roomId).emit("leaderboard",{
            leaderboard
        })
    }
    next() {
        // this.currentState = "problem";
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        const io = IoManager.getIo();

        if (problem) {
           this.setActiveProblem(problem)
        } else {
          this.activeProblem--;
        }

    }
    
    addUser(name: string,roomId:string) {
        const id = uuidv4();
       

        this.users.push({
            id,
            name,
            roomId,
            points: 0
        })
        return id;
    }
    submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmmision) {
        const problem = this.problems.find(x => x.id == problemId);
        const user = this.users.find(x => x.id == userId)
        if (!problem || !user) {
            return
        }
        const existingSubmission = problem.submissions.find(x => x.userId === userId);
        if (existingSubmission) {
            return;
        }       

        problem.submissions.push({
            problemId,
            userId,
            isCorrect: problem.answer == submission,
            optionSelected: submission,
        });

        user.points += 1000 - 500*(new Date().getTime() - problem?.startTime)/PROBLEM_TIME_S
    }
    getUser(id:string){
        return this.users.find((x)=>x.id === id)?.id;
    }
    getLeaderboard(){
        return this.users.sort((a,b)=>a.points<b.points?1:-1).slice(0,20);
    }
    getCurrentState(){
        if(this.currentState === "not_started"){
            return {
                type:"not_started"
            }
        }
        if(this.currentState === "ended"){
            return {
                type:"ended",
                leaderboard:this.getLeaderboard()
            }
        }
        if(this.currentState === "leaderboard"){
            return {
                type:"leaderboard",
                leaderboard:this.getLeaderboard()
            }
        }
        if(this.currentState === "question"){
            const problem = this.problems[this.activeProblem];
            return {
                type:"question",
                problem
            } 
        }
    }

}