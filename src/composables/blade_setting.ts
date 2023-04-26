import bl_pointer from "@/assets/img/bl_pointer.png"
import {nextTick, ref} from "vue";
export const bladeParam = {
    data: 65,
    height : 150,
    width : 150,
    ctx : CanvasRenderingContext2D,
    start_num:95,
    textStyle: {
        color: "#62D5FF",
        fontSize: 18,
        fontWeight: "normal",
        fontFamily: "仿宋"
    },
    label: {
        name: "",
        textStyle: {
            color: "white",
            fontSize: 12,
            fontWeight: "normal",
            fontFamily: "微软雅黑"
        },
    },
    min: -5,
    max: 95,
    r: 44,
    pointer: "@/assets/img/bl_pointer.png",
    angleOffset: 90,
    pointerImage: new Image(),
    ticks: {
        style: {
            width: 1,
            len: 2,
            color: "silver"
        },
        start: 0,
        end: 360,
        count: 12,
        valid: {
            start: 0,
            end: 90,
            width: 3,
            color: ["#65D6FF", "#AE5BFF", "#F55945"],
            label: {
                show: true,
                textStyle: {
                    color: "#62D5FF",
                    fontSize: 12,
                    fontWeight: "normal",
                    fontFamily: "仿宋"
                }
            },
        }
    },
    heart: {
        x:0,
        y:0
    }
}

export function initBladeStyle(data:number, label:string, width:number, height:number) : any{
    bladeParam.height = height
    bladeParam.width = width
    bladeParam.heart.x = width/2
    bladeParam.heart.y = height/2
    bladeParam.label.name = label
    bladeParam.pointerImage.src = bl_pointer
    bladeParam.data = data
   return bladeParam
}

export const bladeSetting = (bladeStyle:any, ctx:CanvasRenderingContext2D) =>{
    //定义一个响应式的值绑定setInterval的id，让组件能实时拿到，从而刷新，不然会有重影
    let clearId = ref(0)
    function scale_animation(now_num:number, start_num:number) {
         clearId.value = setInterval(function () {
             start_num = Number(start_num)
             now_num = Number(now_num)
            if (start_num >= now_num) {
                start_num = start_num - (start_num - now_num ) / 100;
            } else if (start_num <= now_num) {
                start_num = start_num + (now_num - start_num) / 100;
            }
            if (Number(parseFloat(start_num.toString()).toFixed(1)) == now_num) {
                clearInterval(clearId.value);
            }
            nextTick(function (){
                /*这里每一次刷新dom时，必须先清除画布，不然会产生重影*/
                ctx.clearRect(0,0,bladeStyle.width,bladeStyle.height)
                drawPointer(bladeStyle , start_num)
                drawTicks(bladeStyle)
                drawTicksNum(bladeStyle)
                drawValue(bladeStyle)
            })
        }, 10);
        // clearId = qq;

    }
    function drawTicks (serie : any) {
        let count = serie.ticks.count;
        count = count && count < 4 ? 4 : count;
        let arc = (serie.ticks.end - serie.ticks.start) / count;//每个刻度对应的旋转角度
        // console.log(arc)
        let r = serie.r;//仪表盘半径
        let heart = serie.heart;//圆心
        /** 画刻度点 */
        ctx.save();
        ctx.translate(heart.x, heart.y);
        ctx.strokeStyle = serie.ticks.style.color;
        ctx.lineWidth = serie.ticks.style.width;
        let len = serie.ticks.style.len;//刻度的长度
        for (let i = 1; i <= count; ++i) {
            const alpha = Math.PI * arc / 180;
            ctx.rotate(alpha);
            ctx.beginPath();
            ctx.moveTo(0, r);
            ctx.lineTo(0, r - len);
            ctx.stroke();
        }
        ctx.restore();
        /** 画有效区实线 */
        const angle_offset = serie.angleOffset;//由于初始位置默认在-90度，用angle_offset进行补正
        const width = serie.ticks.valid.width;
        const start = Math.PI * (serie.ticks.valid.start + angle_offset) / 180;
        const end = Math.PI * (serie.ticks.valid.end + angle_offset) / 180;

        ctx.save();
        ctx.translate(heart.x, heart.y);
        ctx.lineWidth = width;
        const gradient = ctx.createLinearGradient(0, 0, r, r);
        gradient.addColorStop(0, serie.ticks.valid.color[0]);
        gradient.addColorStop(0.5, serie.ticks.valid.color[1]);
        gradient.addColorStop(1, serie.ticks.valid.color[2]);
        ctx.rotate(Math.PI * angle_offset / 180);
        ctx.beginPath();
        ctx.arc(0, 0, r + 1, start, end, false);
        ctx.strokeStyle = gradient;
        ctx.stroke();
        ctx.restore();
    }
//画刻度数字
    function drawTicksNum (serie : any) {
        if (serie.ticks.valid.label.show) {
            let start_angle = serie.ticks.valid.start;
            let end_angle = serie.ticks.valid.end;
            //每一个刻度间的角度
            const arc = Math.abs(serie.ticks.end - serie.ticks.start) / serie.ticks.count;
            //有几个刻度数字
            const count = 1 + Math.abs(end_angle - start_angle) / arc;
            let heart = serie.heart;

            let textStyle = serie.ticks.valid.label.textStyle;
            let a = 0;
            const textR = serie.r + textStyle.fontSize / 2;
            const angle_offset = serie.angleOffset;
            ctx.fillStyle = textStyle.color;
            ctx.font = textStyle.fontSize + "px " + textStyle.fontFamily;
            for (var i = 0; i < count; ++i) {
                const alpha = Math.PI * (a + angle_offset) / 180;
                let x = -textR * Math.sin(alpha) + heart.x;
                let y = textR * Math.cos(alpha) + heart.y;
                const dim = ctx.measureText(a.toString());
                const textWidth = dim.width * (1 + Math.sin(alpha)) / 2;
                if (x - heart.x < 1e-6) {
                    x -= textWidth;
                }
                ctx.beginPath();
                ctx.fillText(a.toString(), x, y);
                ctx.stroke();
                a += arc;
            }
        }
    }
//画仪表盘的文字显示
    function drawValue (serie : any) {
        let value = serie.data;
        value = parseFloat(value).toFixed(1);
        ctx.fillStyle = serie.textStyle.color;
        ctx.font = serie.textStyle.fontSize + 'px ' + serie.textStyle.fontFamily;
        let dim = ctx.measureText(value);
        ctx.fillText(value, serie.heart.x - dim.width / 2, serie.heart.y + serie.textStyle.fontSize + 3);
        ctx.fillStyle = serie.label.textStyle.color;
        ctx.font = serie.label.textStyle.fontSize + 'px ' + serie.label.textStyle.fontFamily;
        dim = ctx.measureText(serie.label.name);
        ctx.fillText(serie.label.name, serie.heart.x - dim.width / 2, serie.heart.y + serie.textStyle.fontSize + serie.label.textStyle.fontSize + 6);
    }
    function drawPointer (serie : any , now_num : number) {
        /*设置指针图片尺寸、中心位置*/
        const img_height = 96;
        if (now_num > serie.max) {
            now_num = serie.max;
        } else if (now_num < serie.min) {
            now_num = serie.min;
        }
        let pic = serie.pointerImage;
        let img_w = pic.width * serie.r / img_height;
        let img_h = pic.height * serie.r / img_height;
        let o_h = img_h / 6;
        /*画旋转角度后的指针*/
        ctx.save()
        //sctx.clearRect(0,0,150,150)
        ctx.translate(serie.heart.x,serie.heart.y)
        let alpha = (now_num - serie.ticks.valid.end) * Math.PI / 180;
        ctx.rotate(alpha);
        ctx.drawImage(serie.pointerImage, -img_w / 2, -img_h, img_w, img_h + o_h);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
    return{
        scale_animation,
        clearId
    }

}