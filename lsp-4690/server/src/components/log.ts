import { writeFileSync } from 'fs';

export class log {
	readonly logfile: string;
	constructor(readonly file: string){
		this.logfile = file;
	}

	public write = (data: any) : void => {
		const str:string = JSON.stringify(data);
		writeFileSync(this.logfile,str,{flag: 'w'});
	} 
}
