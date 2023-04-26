import {nextTick, ref} from "vue";
import background from "../assets/img/bg.png"
import jk1 from "../assets/img/jk1.png"

export interface gaugeStyleParam {
    max_num: number, //仪表盘最大值
    min_num: number, //仪表盘最小值
    now_num: number, //仪表盘当前值
    canvas_width: number, //画布宽度
    canvas_height: number, //画布高度
    tag: string,  //显示标签名
    unit: string  //单位
}
//gauge组件中用到的数据接口
export interface gauge_data{
    aaa: string,
    pic : HTMLImageElement,
    point_w: number,
    ctx ?: any,
    canvas ?: any,
    zhizhen_img : HTMLImageElement,
    min_num : number,
    max_num : number,
    now_num : number,
    start_num : number,
    yuan_num ?: number,
    qq ?: any,
    dash_now_num ?: number,
    cvs_w ?: number,
    cvs_h ?:number
}

export const gague_style = {
    dash_font: {
        scale_num: "12px normal 黑体", //周围刻度字体
        scale_num_color: "#65D6FF", //周围刻度字体颜色
        current_num: "18px  bold 黑体", //中心数值字体
        current_num_color: "#65D6FF", //中心数值颜色
        tag: "12px  normal 黑体", //中心单位字体
        tag_color: "white", //中心单位颜色
    },
    dash_color: {
        huan_color: ["#65D6FF", "#AE5BFF", "#F55945"], //四周环的渐变色
        //zhen_color: ["#005693"] //周围刻度颜色
        zhen_color: ["#65D6FF", "#AE5BFF", "#F55945"]
    }
}
//老版本scada30 四个仪表盘默认的初始化样式
export const gaugeDataList = {
    rotor: {
        max_num: 20, //仪表盘最大值
        min_num: 0, //仪表盘最小值
        now_num: 0, //仪表盘当前值
        canvas_width: 234, //画布宽度
        canvas_height: 234, //画布高度
        tag: "叶轮转速", //单位
        unit: "rpm"
    },
    wind: {
        max_num: 30, //仪表盘最大值
        min_num: 0, //仪表盘最小值
        now_num: 0, //仪表盘当前值
        canvas_width: 286, //画布宽度
        canvas_height: 286, //画布高度
        tag: "风速", //单位
        unit: "m/s"
    },
    power: {
        max_num: 2000, //仪表盘最大值
        min_num: 0, //仪表盘最小值
        now_num: 0, //仪表盘当前值
        canvas_width: 286, //画布宽度
        canvas_height: 286, //画布高度
        tag: "功率", //单位
        unit: "kw"
    },
    gen: {
        max_num: 2000, //仪表盘最大值
        min_num: 0, //仪表盘最小值
        now_num: 0, //仪表盘当前值
        canvas_width: 234, //画布宽度
        canvas_height: 234, //画布高度
        tag: "发电机转速", //单位
        unit: "rpm"
    }
}
export function initGauge(type:string):gaugeStyleParam{
    return gaugeDataList[type as keyof typeof gaugeDataList]
}

export const gauge_setting = (style_param:gaugeStyleParam) =>{

    let data : gauge_data= {
        aaa: "a",
        point_w: 0,
        dash_now_num: 0,
        min_num: 0,
        max_num: 0,
        now_num: 0,
        start_num: 0,
        pic: new Image(),
        zhizhen_img: new Image(),
    }
    const coeff = 2;
    const padding = 0.5;
    const zoomSize = {
        half: coeff,
        hw: coeff - 2 * padding,
        org: padding,
    }
    data.pic.src= background
    data.zhizhen_img.src = jk1;

    //刻度动画
    function scale_animation(min_num:number, max_num:number, now_num:number, start_num:number) {
        let qq = setInterval(function () {
            if (start_num <= now_num) {
                start_num = start_num + (now_num - start_num) / 100;

            } else if (start_num >= now_num) {
                start_num = start_num - (start_num - now_num) / 100;

            }
            if (Number(start_num.toFixed(1)) == now_num) {
                clearInterval(qq);
            }
            all_methods(min_num, max_num, start_num, start_num);
        }, 10);
        data.qq = qq;
    }

    function all_methods(min_num:number, max_num:number, now_num:number, start_num:number) {
        data.min_num = min_num;
        data.max_num = max_num;
        data.now_num = now_num;
        data.start_num = start_num;
        //等待dom下一次刷新就执行一次
        nextTick(function () {
            initCanvas(data.ctx, data.pic);
        });
    }

    function initCanvas( ctx : CanvasRenderingContext2D, pic :HTMLImageElement) {
        let point_w = data.point_w;
        //背景图
        ctx.fillStyle= '#003951';
        ctx.fillRect(0,0,point_w*2 ,point_w*2);
        ctx.drawImage(pic, point_w / 2, point_w / 2, point_w, point_w);
        scale_num(ctx, data.min_num, data.max_num); //字体
        //
        //圆环
        ctx.beginPath();
        ctx.lineWidth = point_w / 30;
        ctx.lineCap = "round";
        let gradient = ctx.createLinearGradient(0, 0, point_w, point_w);
        gradient.addColorStop(0, gague_style.dash_color.huan_color[0]);
        gradient.addColorStop(0.5, gague_style.dash_color.huan_color[1]);
        gradient.addColorStop(1, gague_style.dash_color.huan_color[2]);
        ctx.arc(point_w, point_w, point_w / 2.05, 0, Math.PI, true);
        ctx.strokeStyle = gradient;
        ctx.stroke();
        //绘制其他刻度
        const kd_count = 20;
        const kd_arc = 360 / kd_count;
        const arc_size = 2 - 0.5 + 0.2;
        const len = 0.2;
        for (var i = 0; i < kd_count+1; i++) {
            ctx.beginPath();
            ctx.save();
            ctx.lineWidth = 0.20; //设置时针的粗细
            ctx.strokeStyle = "#FFF"; //设置时针的颜色
            ctx.translate(point_w, point_w);
            ctx.rotate((i * kd_arc * Math.PI) / 180); //角度*Math.PI/180=弧度
            ctx.beginPath();
            ctx.moveTo(0, -point_w / (arc_size - len));
            ctx.lineTo(0, -point_w / arc_size);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#FFF";
        //指针旋转
        hand(ctx, data.min_num, data.max_num, data.now_num);
    }
   //刻度数字
    function scale_num(ctx:any, min_num:number, max_num:number) {
        let point_w = data.point_w;
        ctx.font = gague_style.dash_font.scale_num;
        // 设置颜色
        ctx.fillStyle = gague_style.dash_font.scale_num_color;
        // 设置水平对齐方式
        ctx.textAlign = "center";
        // 设置垂直对齐方式
        ctx.textBaseline = "middle";
        const font_size = 10;
        ctx.fillText(String(min_num), point_w / (2 * zoomSize.half) - font_size, point_w);
        ctx.fillText(String(max_num), point_w * (zoomSize.half - 1 / (2 * zoomSize.half)) + font_size, point_w);
        ctx.fillText(String((min_num + max_num) / 2), point_w, point_w / (2 * zoomSize.half) - font_size / 2);
        //中心单位
        ctx.textBaseline = "top";
        ctx.fillText(style_param.tag, point_w, point_w / 0.95);
        ctx.fillText(String(style_param.unit), point_w, point_w / 0.85);
        //中心数值
        ctx.font = gague_style.dash_font.current_num;
        ctx.textBaseline = "bottom";
        ctx.fillStyle = gague_style.dash_font.current_num_color;
        ctx.fillText(String(style_param.now_num), point_w, point_w * 0.95);
    }
    function hand(ctx:any, min_num:number, max_num:number, now_scale:number) {
        ctx.save()
        ctx.translate(data.point_w, data.point_w); //设置异次元空间的0，0点，画布的圆心
        now_scale = now_scale < max_num ? now_scale : max_num;
        let angle = ((now_scale - min_num) / (max_num - min_num));//旋转的角度
        let point_w = data.point_w;
        ctx.rotate( angle*Math.PI + 266.5 * Math.PI / 180);
        ctx.drawImage(data.zhizhen_img,-point_w / 24, -point_w / (1.05 + padding),point_w / 6,point_w / 4) //(img,图像的x坐标，图像的y坐标，变化后图像宽度，变换后图像高度)
        ctx.stroke();
        ctx.restore();
        ctx.fill();
    }
    return{
        data,
        scale_animation,
    }

}