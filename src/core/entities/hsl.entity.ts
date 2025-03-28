import { FindHSL, HslSchema } from "../validations/hsl.validations";

export class HSL {
    constructor(
        public id: number,
        public colos_hsl: string,
    ) {}
}