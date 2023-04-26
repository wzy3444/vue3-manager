import {nextTick, ref} from "vue";

export const compassStyle = {
    r: 56,
    color: "rgba(101, 214, 255, 0.6)", //"#AE5BFF 100%",
    canvas_width:321,
    canvas_height:150,
    width: 3,
    ticks: {
        count: 16,
        color: "rgba(174, 91, 255, 0.5)",
        width: 1,
        label: {
            show: true,
            textStyle: {
                color: "#65D6FF",
                fontSize: 10,
                fontFamily: "微软雅黑",
                fontWeight: "normal"
            }
        }
    },
    cabinAngle:{
        angle: 0,
        start_num:0,
        color: "rgba(255, 255, 255, 0.3)",
        textStyle: {
            color: "#65D6FF",
            fontSize: 18,
            fontFamily: "微软雅黑",
            fontWeight: "normal"
        },
        label: {
            name: "机舱角度",
            textStyle: {
                color: "white",
                fontSize: 14,
                fontFamily: "微软雅黑",
                fontWeight: "normal"
            }
        }
    },
    windDirection:{
        r: 56,
        angle: 0,
        start_num:0,
        color: "rgba(174, 91, 255, 0.75)", //"#65D6FF",
        textStyle: {
            color: "#65D6FF",
            fontSize: 18,
            fontFamily: "微软雅黑",
            fontWeight: "normal"
        },
        len: 10,
        label: {
            name: "风  向",
            textStyle: {
                color: "white",
                fontSize: 14,
                fontFamily: "微软雅黑",
                fontWeight: "normal"
            }
        }
    }
};


export function initCompass(windAngle : number, carbinAngle:number,height?:number,width?:number) : any{
    compassStyle.windDirection.angle = windAngle
    compassStyle.cabinAngle.angle = carbinAngle
    if (height != 0 && height != undefined && width != 0 && width != undefined){
        compassStyle.canvas_width = width
        compassStyle.canvas_height = height
    }
    return  compassStyle

}

export const compassSetting = (compassStyle:any,ctx:CanvasRenderingContext2D) =>{
    const dir = [180, 90, 0, 270]
    const heart = {
        x: compassStyle.canvas_width / 2,
        y: compassStyle.canvas_height / 2
    }
    let circle = {
        r: compassStyle.r,
        width: compassStyle.width,
        color: compassStyle.color,
        ticks: compassStyle.ticks
    }
    const windDirection = compassStyle.windDirection
    const cabinAngle = compassStyle.cabinAngle
    let clearId = ref(0)

    function draw(windNow:number, windStart:number, carbinNow:number, carbinStart:number){
        clearId.value = setInterval(function () {
            windNow = aniControl(windStart,windNow).now_num
            windStart = aniControl(windStart,windNow).start_num
            carbinNow = aniControl(carbinStart,carbinNow).now_num
            carbinStart = aniControl(carbinStart,carbinNow).start_num

            if (Number(parseFloat(windStart.toString()).toFixed(1)) == windNow &&
                Number( parseFloat(carbinStart.toString()).toFixed(1)) == carbinNow) {
                clearInterval(clearId.value);
            }
            nextTick(function (){
                ctx.clearRect(0, 0, compassStyle.canvas_width, compassStyle.canvas_height);
                //风向
                drawLabel(windDirection,compassStyle.canvas_width / 5, compassStyle.canvas_height / 2)
                //机舱角度
                drawLabel(cabinAngle,compassStyle.canvas_width * 4 / 5, compassStyle.canvas_height / 2)
                drawPointer(windStart,getOutShape(windDirection),windDirection.color)
                drawNacelle(carbinStart,getNacelleShape(compassStyle),cabinAngle.color)
                drawCircle(heart, circle.r, circle.width, circle.color)
                drawTicks(circle)
                drawTickLabel(circle)
            })
        },10)
    }

    function aniControl(start_num:number, now_num:number){
        start_num = Number(start_num)
        now_num = Number(now_num)
        let distance = Math.abs(now_num - start_num)

        if (start_num >= now_num) {
            if (distance<=180){
                start_num = start_num - (start_num - now_num ) / 100;
            }else if (distance>180){
                start_num = start_num + (now_num - start_num + 360 ) / 100
            }
        } else if (start_num <= now_num) {
            if (distance<=180){
                start_num = start_num + (now_num - start_num) / 100;
            }else if (distance>180){
                start_num = start_num - (start_num - now_num + 360 ) / 100
            }
        }
        return {
            start_num,
            now_num
        }
    }
    //画两侧的风向、机舱角度标签
    function drawLabel(option : any, x: number, y: number) {
        // 数据的字体
        let data = option.angle + " °";
        ctx.font = option.textStyle.fontSize + 'px ' + option.textStyle.fontFamily;
        let dimData = ctx.measureText(data);

        // 标签的字体
        let label = option.label;
        let fontSize = label.textStyle.fontSize;
        ctx.font = fontSize + 'px ';
        ctx.font = fontSize + 'px ' + option.textStyle.fontFamily;
        let dimLabel = ctx.measureText(label.name);

        // 字符最大宽度
        let maxWidth = dimData.width > dimLabel.width ? dimData.width : dimLabel.width;

        // 绘标签
        ctx.fillStyle = label.textStyle.color;
        ctx.clearRect(x - maxWidth - 2, y - fontSize, maxWidth * 2 + 4, fontSize * 3);
        ctx.beginPath();
        ctx.fillText(label.name, x - dimLabel.width / 2, y);

        // 绘数据
        ctx.fillStyle = option.textStyle.color;
        ctx.font = option.textStyle.fontSize + 'px ' + option.textStyle.fontFamily;
        ctx.fillText(data, x - dimData.width / 2, y + fontSize + 8);
        ctx.fill();
    }

    function drawPointer(a:number, shape: any, color : string) {
        let pointers = shape;
        let angle = Math.PI * a / 180;
        ctx.fillStyle = color;
        ctx.save();
        ctx.translate(heart.x, heart.y);
        ctx.rotate(angle);
        ctx.beginPath();
        if (pointers && pointers.length > 0) {
            let pt = pointers[0];
            ctx.moveTo(pt.x, pt.y)
            for (let i = 1; i < pointers.length; ++i) {
                pt = pointers[i];
                ctx.lineTo(pt.x, pt.y);
            }
        }
        ctx.fill(); //填充。stroke不会自动closePath()
        ctx.restore();
    }
    function drawNacelle(a:number, shape:any, color:string) {

        let angle = Math.PI * a / 180;
        ctx.save();
        ctx.translate(heart.x, heart.y);
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.beginPath();
        if (shape && shape.length > 0) {
            let pt = shape[0];
            ctx.moveTo(pt.x, pt.y)
            for (let i = 1; i < shape.length; ++i) {
                pt = shape[i];
                ctx.lineTo(pt.x, pt.y);
            }
        }
        ctx.fill(); //填充。stroke不会自动closePath()
        ctx.restore();
    }
    function drawCircle (heart:any, r:number, width:number, color:string) {
        ctx.save();
        ctx.translate(heart.x, heart.y);
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, r - width, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
    function drawTicks (circle:any) {
        let ticks = circle.ticks;
        const len = 3;
        let count = ticks.count;
        let arc = 360 / count;
        ctx.save();
        ctx.translate(heart.x, heart.y);
        ctx.beginPath();
        ctx.strokeStyle = circle.ticks.color;
        ctx.lineWidth = circle.ticks.width;
        for (let i = 0; i < count; ++i) {
            let x = 0;
            let y = circle.r - 2 * circle.width;
            let angle = arc * i;
            ctx.moveTo(x, y);
            if (angle % 90 == 0) {
                ctx.lineTo(x, y - 2 * len);
            } else {
                ctx.lineTo(x, y - len);
            }
            ctx.rotate(arc * Math.PI / 180);
        }
        ctx.stroke();
        ctx.restore();
    }
    function drawTickLabel (circle:any) {
        let label = circle.ticks.label;
        if (label.show) {
            let arc = Math.PI / 2;

            ctx.save();
            ctx.fillStyle = label.textStyle.color;
            ctx.font = label.textStyle.fontSize + 'px ' + label.textStyle.fontFamily;
            ctx.translate(heart.x, heart.y);
            ctx.beginPath();
            for (let i = 0; i < dir.length; ++i) {
                let dim = ctx.measureText(String(dir[i]));
                let width = dim.width;
                let height = label.textStyle.fontSize;
                if (i == 0) {
                    width = -width / 2;
                    height = -(height + circle.width);
                } else if (i == 1) {
                    width = -(width + 5 * circle.width);
                    height = height / 3;
                } else if (i == 2) {
                    width = -width / 2;
                    height = (height + 4 * circle.width);
                } else {
                    height = height / 3;
                }
                let x = circle.r * Math.sin(i * arc);
                let y = circle.r * Math.cos(i * arc);
                ctx.fillText(String(dir[i]), x + width, y + height);
            }

            ctx.fill();
            ctx.restore();
        }
    }
    function getOutShape(option:any) {
        let x = 0;
        let y = -option.r;
        let len = option.len;
        let x1 = x - len;
        let x2 = x + len;
        let y1 = y - len;
        let y01 = y - len / 2;
        let y2 = y01 - len;
        let y02 = y01 - len / 2;

        return [
            { x: x, y: y },
            { x: x1, y: y1 },
            { x: x, y: y01 },
            { x: x1, y: y2 },
            { x: x, y: y02 },
            { x: x2, y: y2 },
            { x: x, y: y01 },
            { x: x2, y: y1 }
        ]
    }

    function getNacelleShape(option : any) {
        const x = 0;
        const y = -(option.r - 4 * option.width);
        const rotor_l = 8;
        const nac_w = option.r / 6;
        const nac_l = (option.r - option.width * 2) * 2 - rotor_l * 3;
        return [{ x: x, y: y },
            { x: x - nac_w, y: y + rotor_l },
            { x: x - nac_w, y: y + nac_l },
            { x: x + nac_w, y: y + nac_l },
            { x: x + nac_w, y: y + rotor_l }
        ]
    }
    return{
        draw,
        clearId
    }
}