import color from 'chalk'

export class Logger {
    private logger: typeof console.log

    constructor(logger = console.log) {
        this.logger = logger
    }

    success(msg: string) {
        this.logger(`${color.cyan('[success]')} ${msg}`)
    }

    failure(msg: string) {
        this.logger(`${color.cyan('[failure]')} ${msg}`)
    }
}