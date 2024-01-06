export class Engine {
    //@ts-ignore
    stockfish: Worker;
    onMessage: (callback: (e: any) => void) => void;
    // sendMessage: (message: any) => void;
    constructor() {
        this.stockfish = new Worker("./stockfish.js");
        this.onMessage = (callback) => {
            this.stockfish.addEventListener("message", (e: any) => {
                const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];
                callback({ bestMove });
            });
        };
        // Init engine
        this.onMessage(() => "uci");
        this.onMessage(() => "isready");
    }
    sendMessage(arg0: string) {
        throw new Error("Method not implemented.");
    }

    evaluatePosition(fen: any, depth: any) {
        this.stockfish.postMessage(`position fen ${fen}`);
        this.stockfish.postMessage(`go depth ${depth}`);
    }
    stop() {
        this.onMessage(() => "stop"); // Run when changing positions
    }
    quit() {
        this.onMessage(() => "quit"); // Good to run this before unmounting.
    }
}
