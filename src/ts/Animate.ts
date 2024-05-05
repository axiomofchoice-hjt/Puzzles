import gsap from 'gsap';
export class Animate {

  static duration = 0.3;
  static to(targets: any, vars: gsap.TweenVars, params: gsap.TweenVars = {}) {
    gsap.to(targets, { ...vars, ...params, duration: Animate.duration });
  }
  static toQuick(targets: any, vars: gsap.TweenVars, params: gsap.TweenVars = {}) {
    gsap.to(targets, { ...vars, ...params, duration: Animate.duration / 2 });
  }
}
