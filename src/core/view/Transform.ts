import { Constructor } from "../../types";
import { vec2, vec3 } from "gl-matrix";
import { BaseView } from "./View";

export function Transform<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    /**
    * Rotation value
    * @protected
    * @type {vec3}
    */
    protected _rotation: vec3;

    /**
    * translation value
    * @protected
    * @type {vec3}
    */
    protected _translation: vec3;

    /**
    * Transformation center (origin)
    * @protected
    * @type {vec2}
    */
    protected _transform_origin: vec2;

    /**
    * Scale value
    * @protected
    * @type {number}
    */
    protected _scaling: number;
    protected __should_update_gl_matrix: boolean;
    protected __invalid_matrixes: boolean;

    constructor(...args: any[]) {
      super(...args);
      this._rotation = vec3.create();
      this._translation = vec3.create();
      this._transform_origin = vec2.create();

      this._scaling = 1;

      this._transform_origin[0] = 0;
      this._transform_origin[1] = 0;

      this._rotation[0] = 0;
      this._rotation[1] = 0;
      this._rotation[2] = 0;

      this._translation[0] = 0;
      this._translation[1] = 0;
      this._translation[2] = 0;

      this.__should_update_gl_matrix = true;
      this.__invalid_matrixes = true;
    }

    /**
     * This property allows you to specify the origin of the 2D transformations.
     * Values are pourcentage of the view size.
     * <p>
     * The property is set by default to [50, 50], which is the center of
     * the view.
     * @name vs.ui.Transform#transformOrigin
     * @type Array.<number>
     */
    set transformOrigin(v: number[]) {
      if (v.length !== 2) { return; }

      this._transform_origin[0] = v[0];
      this._transform_origin[1] = v[1];

      BaseView.__should_render = true;
    }

    /**
     * @ignore
     * @return {Array}
     */
    get transformOrigin(): number[] {
      return [this._transform_origin[0], this._transform_origin[1]];
    }

    /**
    * Translation vector [tx, ty]
    * <=> obj.translate (tx, ty)
    * @name vs.ui.Transform#translation
    * @type {Array}
    */
    set translation(v: number[]) {
      if (v.length !== 2 && v.length !== 3) { return; }

      this._translation[0] = v[0];
      this._translation[1] = v[1];
      this._translation[2] = v[2] || 0;

      this.__should_update_gl_matrix = true;
      BaseView.__should_render = true;
    }

    /**
     * @ignore
     * @type {Array}
     */
    get translation(): number[] {
      return [this._translation[0], this._translation[1], this._translation[2]];
    }

    /**
     * Rotation angle in degre
     * @name vs.ui.Transform#rotation
     * @type {float}
     */
    set rotation(v: number[]) {
      this._rotation[0] = v[0] || 0;
      this._rotation[1] = v[1] || 0;
      this._rotation[2] = v[2] || 0;

      this.__should_update_gl_matrix = true;
      BaseView.__should_render = true;
    }

    /**
     * @ignore
     * @type {float}
     */
    get rotation(): number[] {
      return [this._rotation[0], this._rotation[1], this._rotation[2]];
    }

    /**
     * Scale the view
     * @name vs.ui.Transform#scaling
     * @type {float}
     */
    set scaling(v: number) {
      this._scaling = v;

      this.__should_update_gl_matrix = true;
      BaseView.__should_render = true;
    }

    /**
     * @ignore
     * @type {float}
     */
    get scaling(): number {
      return this._scaling;
    }
  }
}
