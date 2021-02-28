/* eslint-disable */
 
/*!
 * pixi-tilemap - v2.1.4
 * Compiled Sun, 28 Feb 2021 10:54:03 UTC
 *
 * pixi-tilemap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2020, Ivan Popelyshev, All Rights Reserved
 */
this.PIXI = this.PIXI || {};
this.PIXI.tilemap = this.PIXI.tilemap || {};
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@pixi/display'), require('@pixi/core'), require('@pixi/constants'), require('@pixi/math'), require('@pixi/graphics'), require('@pixi/sprite')) :
    typeof define === 'function' && define.amd ? define(['exports', '@pixi/display', '@pixi/core', '@pixi/constants', '@pixi/math', '@pixi/graphics', '@pixi/sprite'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.pixi_tilemap = {}, global.PIXI, global.PIXI, global.PIXI, global.PIXI, global.PIXI, global.PIXI));
}(this, (function (exports, display, core, constants, math, graphics, sprite) { 'use strict';

    class CanvasTileRenderer {
        
        __init() {this.tileAnim = [0, 0];}
        __init2() {this.dontUseTransform = false;}

        constructor(renderer) {;CanvasTileRenderer.prototype.__init.call(this);CanvasTileRenderer.prototype.__init2.call(this);
            this.renderer = renderer;
            this.tileAnim = [0, 0];
        }
    }

    const cr = (PIXI ).CanvasRenderer;

    if (cr) {
        cr.registerPlugin('tilemap', CanvasTileRenderer);
    }

    /// <reference path="types.d.ts" />

    const Constant = {
        maxTextures: 16,
        bufferSize: 2048,
        boundSize: 1024,
        boundCountPerBuffer: 1,
        use32bitIndex: false,
        SCALE_MODE: constants.SCALE_MODES.LINEAR,
        DO_CLEAR: true
    };

    /// <reference path="types.d.ts" />



    const POINT_STRUCT_SIZE = 12;

    class RectTileLayer extends display.Container {
        constructor(zIndex, texture) {
            super();RectTileLayer.prototype.__init.call(this);RectTileLayer.prototype.__init2.call(this);RectTileLayer.prototype.__init3.call(this);RectTileLayer.prototype.__init4.call(this);RectTileLayer.prototype.__init5.call(this);RectTileLayer.prototype.__init6.call(this);RectTileLayer.prototype.__init7.call(this);RectTileLayer.prototype.__init8.call(this);RectTileLayer.prototype.__init9.call(this);RectTileLayer.prototype.__init10.call(this);RectTileLayer.prototype.__init11.call(this);RectTileLayer.prototype.__init12.call(this);RectTileLayer.prototype.__init13.call(this);RectTileLayer.prototype.__init14.call(this);RectTileLayer.prototype.__init15.call(this);RectTileLayer.prototype.__init16.call(this);;
            this.initialize(zIndex, texture);
        }

        __init() {this.zIndex = 0;}
        __init2() {this.modificationMarker = 0;}
        __init3() {this._$_localBounds = new display.Bounds();}
        __init4() {this.shadowColor = new Float32Array([0.0, 0.0, 0.0, 0.5]);}
        __init5() {this._globalMat = null;}

        __init6() {this.pointsBuf = [];}
        __init7() {this.hasAnim = false;}
        

        __init8() {this.offsetX = 0;}
        __init9() {this.offsetY = 0;}
        __init10() {this.compositeParent = false;}
        __init11() {this.tileAnim = null;}

        initialize(zIndex, textures) {
            if (!textures) {
                textures = [];
            } else if (!(textures instanceof Array) && (textures ).baseTexture) {
                textures = [textures ];
            }
            this.textures = textures ;
            this.zIndex = zIndex;
            // this.visible = false;
        }

        clear() {
            this.pointsBuf.length = 0;
            this.modificationMarker = 0;
            this._$_localBounds.clear();
            this.hasAnim = false;
        }

        addFrame(texture_, x, y, animX, animY) {
            let texture;
            let textureIndex = 0;

            if (typeof texture_ === "number") {
                textureIndex = texture_;
                texture = this.textures[textureIndex];
            } else {
                if (typeof texture_ === "string") {
                    texture = core.Texture.from(texture_);
                } else {
                    texture = texture_ ;
                }

                let found = false;
                let textureList = this.textures;
                for (let i = 0; i < textureList.length; i++) {
                    if (textureList[i].baseTexture === texture.baseTexture) {
                        textureIndex = i;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    // textureIndex = this.textures.length;
                    // this.textures.push(texture);
                    return false;
                }
            }

            this.addRect(textureIndex, texture.frame.x, texture.frame.y, x, y, texture.orig.width, texture.orig.height, animX, animY, texture.rotate);
            return true;
        }

        addRect(textureIndex, u, v, x, y, tileWidth, tileHeight,
                animX = 0, animY = 0, rotate = 0, animCountX = 1024, animCountY = 1024) {
            let pb = this.pointsBuf;
            this.hasAnim = this.hasAnim || animX > 0 || animY > 0;
            pb.push(u);
            pb.push(v);
            pb.push(x);
            pb.push(y);
            pb.push(tileWidth);
            pb.push(tileHeight);
            pb.push(rotate);
            pb.push(animX | 0);
            pb.push(animY | 0);
            pb.push(textureIndex);
            pb.push(animCountX);
            pb.push(animCountY);

            this._$_localBounds.addFramePad(x, y, x+tileWidth, y+tileHeight, 0, 0);

            return this;
        }

        tileRotate(rotate) {
            const pb = this.pointsBuf;
            pb[pb.length - 3] = rotate;
        }

        tileAnimX(offset, count) {
            const pb = this.pointsBuf;

            pb[pb.length - 5] = offset;
            pb[pb.length - 2] = count;
        }

        tileAnimY(offset, count) {
            const pb = this.pointsBuf;

            pb[pb.length - 4] = offset;
            pb[pb.length - 1] = count;
        }

        renderCanvas(renderer) {
            let plugin = renderer.plugins.tilemap;
            if (!plugin.dontUseTransform) {
                let wt = this.worldTransform;
                renderer.context.setTransform(
                    wt.a,
                    wt.b,
                    wt.c,
                    wt.d,
                    wt.tx * renderer.resolution,
                    wt.ty * renderer.resolution
                );
            }
            this.renderCanvasCore(renderer);
        }

        renderCanvasCore(renderer) {
            if (this.textures.length === 0) return;
            let points = this.pointsBuf;
            const tileAnim = this.tileAnim || renderer.plugins.tilemap.tileAnim;
            renderer.context.fillStyle = '#000000';
            for (let i = 0, n = points.length; i < n; i += POINT_STRUCT_SIZE) {
                let x1 = points[i], y1 = points[i + 1];
                let x2 = points[i + 2], y2 = points[i + 3];
                let w = points[i + 4];
                let h = points[i + 5];
                var rotate = points[i + 6];
                x1 += points[i + 7] * tileAnim[0];
                y1 += points[i + 8] * tileAnim[1];
                let textureIndex = points[i + 9];
                // canvas does not work with rotate yet
                if (textureIndex >= 0) {
                    renderer.context.drawImage((this.textures[textureIndex].baseTexture ).getDrawableSource(), x1, y1, w, h, x2, y2, w, h);
                } else {
                    renderer.context.globalAlpha = 0.5;
                    renderer.context.fillRect(x2, y2, w, h);
                    renderer.context.globalAlpha = 1;
                }
            }
        }

        __init12() {this.vbId = 0;}
        __init13() {this.vb = null;}
        __init14() {this.vbBuffer = null;}
        __init15() {this.vbArray = null;}
        __init16() {this.vbInts = null;}

        destroyVb() {
            if (this.vb) {
                this.vb.destroy();
                this.vb = null;
            }
        }

        render(renderer) {
            let plugin = (renderer.plugins )['tilemap'];
            let shader = plugin.getShader();
            renderer.batch.setObjectRenderer(plugin);
            this._globalMat = shader.uniforms.projTransMatrix;
            renderer.globalUniforms.uniforms.projectionMatrix.copyTo(this._globalMat).append(this.worldTransform);
            shader.uniforms.shadowColor = this.shadowColor;
            shader.uniforms.animationFrame = this.tileAnim || plugin.tileAnim;
            this.renderWebGLCore(renderer, plugin);
        }

        renderWebGLCore(renderer, plugin) {
            let points = this.pointsBuf;
            if (points.length === 0) return;
            let rectsCount = points.length / POINT_STRUCT_SIZE;

            let shader = plugin.getShader();
            let textures = this.textures;
            if (textures.length === 0) return;

            plugin.bindTextures(renderer, shader, textures);
            renderer.shader.bind(shader, false);

            //lost context! recover!
            let vb = this.vb;
            if (!vb) {
                vb = plugin.createVb();
                this.vb = vb;
                this.vbId = (vb ).id;
                this.vbBuffer = null;
                this.modificationMarker = 0;
            }

            plugin.checkIndexBuffer(rectsCount, vb);
            const boundCountPerBuffer = Constant.boundCountPerBuffer;

            let vertexBuf = vb.getBuffer('aVertexPosition');
            //if layer was changed, re-upload vertices
            let vertices = rectsCount * vb.vertPerQuad;
            if (vertices === 0) return;
            if (this.modificationMarker !== vertices) {
                this.modificationMarker = vertices;
                let vs = vb.stride * vertices;
                if (!this.vbBuffer || this.vbBuffer.byteLength < vs) {
                    //!@#$ happens, need resize
                    let bk = vb.stride;
                    while (bk < vs) {
                        bk *= 2;
                    }
                    this.vbBuffer = new ArrayBuffer(bk);
                    this.vbArray = new Float32Array(this.vbBuffer);
                    this.vbInts = new Uint32Array(this.vbBuffer);
                    vertexBuf.update(this.vbBuffer);
                }

                let arr = this.vbArray, ints = this.vbInts;
                //upload vertices!
                let sz = 0;
                //let tint = 0xffffffff;
                let textureId = 0;
                let shiftU = this.offsetX;
                let shiftV = this.offsetY;

                //let tint = 0xffffffff;
                let tint = -1;
                for (let i = 0; i < points.length; i += POINT_STRUCT_SIZE) {
                    let eps = 0.5;
                    if (this.compositeParent) {
                        if (boundCountPerBuffer > 1) {
                            //TODO: what if its more than 4?
                            textureId = (points[i + 9] >> 2);
                            shiftU = this.offsetX * (points[i + 9] & 1);
                            shiftV = this.offsetY * ((points[i + 9] >> 1) & 1);
                        } else {
                            textureId = points[i + 9];
                            shiftU = 0;
                            shiftV = 0;
                        }
                    }
                    let x = points[i + 2], y = points[i + 3];
                    let w = points[i + 4], h = points[i + 5];
                    let u = points[i] + shiftU, v = points[i + 1] + shiftV;
                    let rotate = points[i + 6];

                    const animX = points[i + 7], animY = points[i + 8];
                    const animWidth = points[i + 10] || 1024, animHeight = points[i + 11] || 1024;
                    const animXEncoded = animX + (animWidth * 2048);
                    const animYEncoded = animY + (animHeight * 2048);

                    let u0, v0, u1, v1, u2, v2, u3, v3;
                    if (rotate === 0) {
                        u0 = u;
                        v0 = v;
                        u1 = u + w;
                        v1 = v;
                        u2 = u + w;
                        v2 = v + h;
                        u3 = u;
                        v3 = v + h;
                    } else {
                        let w2 = w / 2;
                        let h2 = h / 2;
                        if (rotate % 4 !== 0) {
                            w2 = h / 2;
                            h2 = w / 2;
                        }
                        const cX = u + w2;
                        const cY = v + h2;

                        rotate = math.groupD8.add(rotate, math.groupD8.NW);
                        u0 = cX + (w2 * math.groupD8.uX(rotate));
                        v0 = cY + (h2 * math.groupD8.uY(rotate));

                        rotate = math.groupD8.add(rotate, 2); // rotate 90 degrees clockwise
                        u1 = cX + (w2 * math.groupD8.uX(rotate));
                        v1 = cY + (h2 * math.groupD8.uY(rotate));

                        rotate = math.groupD8.add(rotate, 2);
                        u2 = cX + (w2 * math.groupD8.uX(rotate));
                        v2 = cY + (h2 * math.groupD8.uY(rotate));

                        rotate = math.groupD8.add(rotate, 2);
                        u3 = cX + (w2 * math.groupD8.uX(rotate));
                        v3 = cY + (h2 * math.groupD8.uY(rotate));
                    }

                    arr[sz++] = x;
                    arr[sz++] = y;
                    arr[sz++] = u0;
                    arr[sz++] = v0;
                    arr[sz++] = u + eps;
                    arr[sz++] = v + eps;
                    arr[sz++] = u + w - eps;
                    arr[sz++] = v + h - eps;
                    arr[sz++] = animXEncoded;
                    arr[sz++] = animYEncoded;
                    arr[sz++] = textureId;
                    arr[sz++] = x + w;
                    arr[sz++] = y;
                    arr[sz++] = u1;
                    arr[sz++] = v1;
                    arr[sz++] = u + eps;
                    arr[sz++] = v + eps;
                    arr[sz++] = u + w - eps;
                    arr[sz++] = v + h - eps;
                    arr[sz++] = animXEncoded;
                    arr[sz++] = animYEncoded;
                    arr[sz++] = textureId;
                    arr[sz++] = x + w;
                    arr[sz++] = y + h;
                    arr[sz++] = u2;
                    arr[sz++] = v2;
                    arr[sz++] = u + eps;
                    arr[sz++] = v + eps;
                    arr[sz++] = u + w - eps;
                    arr[sz++] = v + h - eps;
                    arr[sz++] = animXEncoded;
                    arr[sz++] = animYEncoded;
                    arr[sz++] = textureId;
                    arr[sz++] = x;
                    arr[sz++] = y + h;
                    arr[sz++] = u3;
                    arr[sz++] = v3;
                    arr[sz++] = u + eps;
                    arr[sz++] = v + eps;
                    arr[sz++] = u + w - eps;
                    arr[sz++] = v + h - eps;
                    arr[sz++] = animXEncoded;
                    arr[sz++] = animYEncoded;
                    arr[sz++] = textureId;
                }

                vertexBuf.update(arr);
            }

            (renderer.geometry ).bind(vb, shader);
            renderer.geometry.draw(constants.DRAW_MODES.TRIANGLES, rectsCount * 6, 0);
        }

        isModified(anim) {
            if (this.modificationMarker !== this.pointsBuf.length ||
                anim && this.hasAnim) {
                return true;
            }
            return false;
        }

        clearModify() {
            this.modificationMarker = this.pointsBuf.length;
        }

         _calculateBounds()
        {
            const { minX, minY, maxX, maxY } = this._$_localBounds;

            this._bounds.addFrame(this.transform, minX, minY, maxX, maxY);
        }

         getLocalBounds(rect)
        {
            // we can do a fast local bounds if the sprite has no children!
            if (this.children.length === 0)
            {
                return this._$_localBounds.getRectangle(rect);
            }

            return super.getLocalBounds.call(this, rect);
        }

        destroy(options) {
            super.destroy(options);
            this.destroyVb();
        }
    }

    /// <reference path="types.d.ts" />

    class CompositeRectTileLayer extends display.Container {
        constructor(zIndex, bitmaps, texPerChild) {
            super();CompositeRectTileLayer.prototype.__init.call(this);CompositeRectTileLayer.prototype.__init2.call(this);CompositeRectTileLayer.prototype.__init3.call(this);CompositeRectTileLayer.prototype.__init4.call(this);CompositeRectTileLayer.prototype.__init5.call(this);;
            this.initialize.apply(this, arguments);
        }

        
        
        __init() {this.modificationMarker = 0;}
        __init2() {this.shadowColor = new Float32Array([0.0, 0.0, 0.0, 0.5]);}
        __init3() {this._globalMat = null;}
        __init4() {this._lastLayer = null;}

        
        __init5() {this.tileAnim = null;}

        initialize(zIndex, bitmaps, texPerChild) {
            if (texPerChild  === true) {
                //old format, ignore it!
                texPerChild = 0;
            }
            this.z = this.zIndex = zIndex;
            this.texPerChild = texPerChild || Constant.boundCountPerBuffer * Constant.maxTextures;
            if (bitmaps) {
                this.setBitmaps(bitmaps);
            }
        }

        setBitmaps(bitmaps) {
            for (let i=0;i<bitmaps.length;i++) {
                if (bitmaps[i] && !bitmaps[i].baseTexture) {
                    throw new Error(`pixi-tilemap cannot use destroyed textures. `+
                        `Probably, you passed resources['myAtlas'].texture in pixi > 5.2.1, it does not exist there.`);
                }
            }
            let texPerChild = this.texPerChild;
            let len1 = this.children.length;
            let len2 = Math.ceil(bitmaps.length / texPerChild);
            let i;
            for (i = 0; i < len1; i++) {
                (this.children[i] ).textures = bitmaps.slice(i * texPerChild, (i + 1) * texPerChild);
            }
            for (i = len1; i < len2; i++) {
                let layer = new RectTileLayer(this.zIndex, bitmaps.slice(i * texPerChild, (i + 1) * texPerChild));
                layer.compositeParent = true;
                layer.offsetX = Constant.boundSize;
                layer.offsetY = Constant.boundSize;
                this.addChild(layer);
            }
        }

        clear() {
            for (let i = 0; i < this.children.length; i++) {
                (this.children[i] ).clear();
            }
            this.modificationMarker = 0;
        }

        addRect(textureIndex, u, v, x, y, tileWidth, tileHeight, animX, animY, rotate, animWidth, animHeight) {
            const childIndex = textureIndex / this.texPerChild >> 0;
            const textureId = textureIndex % this.texPerChild;

            if (this.children[childIndex] && (this.children[childIndex] ).textures) {
                this._lastLayer = (this.children[childIndex] );
                this._lastLayer.addRect(textureId, u, v, x, y, tileWidth, tileHeight, animX, animY, rotate, animWidth, animHeight);
            } else {
                this._lastLayer = null;
            }

            return this;
        }

        tileRotate(rotate) {
            if (this._lastLayer)
            {
                this._lastLayer.tileRotate(rotate);
            }
            return this;
        }

        tileAnimX(offset, count) {
            if (this._lastLayer)
            {
                this._lastLayer.tileAnimX(offset, count);
            }
            return this;
        }

        tileAnimY(offset, count) {
            if (this._lastLayer)
            {
                this._lastLayer.tileAnimY(offset, count);
            }
            return this;
        }

        addFrame(texture_, x, y, animX, animY, animWidth, animHeight) {
            let texture;
            let layer = null;
            let ind = 0;
            let children = this.children;

            this._lastLayer = null;
            if (typeof texture_ === "number") {
                let childIndex = texture_ / this.texPerChild >> 0;
                layer = children[childIndex] ;

                if (!layer) {
                    layer = children[0] ;
                    if (!layer) {
                        return this;
                    }
                    ind = 0;
                } else {
                    ind = texture_ % this.texPerChild;
                }

                texture = layer.textures[ind];
            } else {
                if (typeof texture_ === "string") {
                    texture = core.Texture.from(texture_);
                } else {
                    texture = texture_ ;
                }

                for (let i = 0; i < children.length; i++) {
                    let child = children[i] ;
                    let tex = child.textures;
                    for (let j = 0; j < tex.length; j++) {
                        if (tex[j].baseTexture === texture.baseTexture) {
                            layer = child;
                            ind = j;
                            break;
                        }
                    }
                    if (layer) {
                        break;
                    }
                }

                if (!layer) {
                    for (let i = 0; i < children.length; i++) {
                        let child = children[i] ;
                        if (child.textures.length < this.texPerChild) {
                            layer = child;
                            ind = child.textures.length;
                            child.textures.push(texture);
                            break;
                        }
                    }
                    if (!layer) {
                        layer = new RectTileLayer(this.zIndex, texture);
                        layer.compositeParent = true;
                        layer.offsetX = Constant.boundSize;
                        layer.offsetY = Constant.boundSize;
                        this.addChild(layer);
                        ind = 0;
                    }
                }
            }

            this._lastLayer = layer;
            layer.addRect(ind, texture.frame.x, texture.frame.y, x, y, texture.orig.width, texture.orig.height, animX, animY, texture.rotate, animWidth, animHeight);
            return this;
        }

        renderCanvas(renderer) {
            if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
                return;
            }
            let plugin = renderer.plugins.tilemap;
            if (!plugin.dontUseTransform) {
                let wt = this.worldTransform;
                renderer.context.setTransform(
                    wt.a,
                    wt.b,
                    wt.c,
                    wt.d,
                    wt.tx * renderer.resolution,
                    wt.ty * renderer.resolution
                );
            }
            let layers = this.children;
            for (let i = 0; i < layers.length; i++) {
                const layer = (layers[i] );
                layer.tileAnim = this.tileAnim;
                layer.renderCanvasCore(renderer);
            }
        }

        render(renderer) {
            if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
                return;
            }
            let plugin = (renderer.plugins )['tilemap'];
            let shader = plugin.getShader();
            renderer.batch.setObjectRenderer(plugin);
            //TODO: dont create new array, please
            this._globalMat = shader.uniforms.projTransMatrix;
            renderer.globalUniforms.uniforms.projectionMatrix.copyTo(this._globalMat).append(this.worldTransform);
            shader.uniforms.shadowColor = this.shadowColor;
            shader.uniforms.animationFrame = this.tileAnim || plugin.tileAnim;
            // We don't need to sync uniforms here. Rect tile layer syncs uniform.
            renderer.shader.bind(shader, true);
            let layers = this.children;
            for (let i = 0; i < layers.length; i++) {
                const layer = (layers[i] );
                layer.renderWebGLCore(renderer, plugin);
            }
        }

        isModified(anim) {
            let layers = this.children;
            if (this.modificationMarker !== layers.length) {
                return true;
            }
            for (let i = 0; i < layers.length; i++) {
                if ((layers[i] ).isModified(anim)) {
                    return true;
                }
            }
            return false;
        }

        clearModify() {
            let layers = this.children;
            this.modificationMarker = layers.length;
            for (let i = 0; i < layers.length; i++) {
                (layers[i] ).clearModify();
            }
        }
    }

    /// <reference path="types.d.ts" />

    class GraphicsLayer extends graphics.Graphics {
        constructor(zIndex) {
            super();
            this.zIndex = zIndex;
        }

        renderCanvas(renderer) {
            let wt = null;
            if (renderer.plugins.tilemap.dontUseTransform) {
                wt = this.transform.worldTransform;
                this.transform.worldTransform = math.Matrix.IDENTITY;
            }
            renderer.plugins.graphics.render(this);
            if (renderer.plugins.tilemap.dontUseTransform) {
                this.transform.worldTransform = wt;
            }
            renderer.context.globalAlpha = 1.0;
        }

        // renderWebGL(renderer: PIXI.Renderer) {
        //     if (!this._webGL[renderer.CONTEXT_UID])
        //         this.dirty++;
        //     super.renderWebGL(renderer)
        // }

        isModified(anim) {
            return false;
        }

        clearModify() {
        }
    }

    /// <reference path="types.d.ts" />








    class MultiTextureResource extends core.resources.Resource {
    	constructor(options) {
    		super(options.bufferSize, options.bufferSize);MultiTextureResource.prototype.__init.call(this);MultiTextureResource.prototype.__init2.call(this);MultiTextureResource.prototype.__init3.call(this);MultiTextureResource.prototype.__init4.call(this);MultiTextureResource.prototype.__init5.call(this);MultiTextureResource.prototype.__init6.call(this);;

    		const bounds = this.boundSprites;
    		const dirties = this.dirties;
    		this.boundSize = options.boundSize;
    		for (let j = 0; j < options.boundCountPerBuffer; j++) {
    			const spr = new sprite.Sprite();
    			spr.position.x = options.boundSize * (j & 1);
    			spr.position.y = options.boundSize * (j >> 1);
    			bounds.push(spr);
    			dirties.push(0);
    		}
    		this.DO_CLEAR = !!options.DO_CLEAR;
    	}

    	__init() {this.DO_CLEAR = false;}
    	__init2() {this.boundSize = 0;}
    	__init3() {this._clearBuffer = null;}

    	bind(baseTexture) {
    		if (this.baseTex) {
    			throw new Error('Only one baseTexture is allowed for this resource!')
    		}
    		this.baseTex = baseTexture;
    		super.bind(baseTexture);
    	}

    	__init4() {this.baseTex = null;}
    	__init5() {this.boundSprites = [];}
    	__init6() {this.dirties = [];}

    	setTexture(ind, texture) {
    		const spr = this.boundSprites[ind];
    		if (spr.texture.baseTexture === texture.baseTexture) {
    			return;
    		}
    		spr.texture = texture;
    		this.baseTex.update();
    		this.dirties[ind] = (this.baseTex ).dirtyId;
    	}

    	upload(renderer, texture, glTexture) {
    		const { gl } = renderer ;

    		const {width, height} = this;
    		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.alphaMode === undefined ||
    			texture.alphaMode === constants.ALPHA_MODES.UNPACK);

    		if (glTexture.dirtyId < 0) {
    			(glTexture ).width = width;
    			(glTexture ).height = height;

    			gl.texImage2D(texture.target, 0,
    				texture.format,
    				width,
    				height,
    				0,
    				texture.format,
    				texture.type,
    				null);
    		}

    		const doClear = this.DO_CLEAR;
    		if (doClear && !this._clearBuffer) {
    			this._clearBuffer = new Uint8Array(Constant.boundSize * Constant.boundSize * 4);
    		}

    		const bounds = this.boundSprites;
    		for (let i = 0; i < bounds.length; i++) {
    			const spr = bounds[i];
    			const tex = spr.texture.baseTexture;
    			if (glTexture.dirtyId >= this.dirties[i]) {
    				continue;
    			}
    			const res = tex.resource ;
    			if (!tex.valid || !res || !res.source) {
    				continue;
    			}
    			if (doClear && (tex.width < this.boundSize || tex.height < this.boundSize))
    			{
    				gl.texSubImage2D(texture.target, 0,
    					spr.position.x,
    					spr.position.y,
    					this.boundSize,
    					this.boundSize,
    					texture.format,
    					texture.type,
    					this._clearBuffer);
    			}
    			gl.texSubImage2D(texture.target, 0,
    				spr.position.x,
    				spr.position.y,
    				texture.format,
    				texture.type,
    				res.source);
    		}

    		return true;
    	}
    }

    function fillSamplers(shader, maxTextures) {
        let sampleValues = [];
        for (let i = 0; i < maxTextures; i++)
        {
            sampleValues[i] = i;
        }
        shader.uniforms.uSamplers = sampleValues;

        let samplerSize = [];
        for (let i = 0; i < maxTextures; i++) {
            samplerSize.push(1.0 / Constant.bufferSize);
            samplerSize.push(1.0 / Constant.bufferSize);
        }
        shader.uniforms.uSamplerSize = samplerSize;
    }

    function generateFragmentSrc(maxTextures, fragmentSrc) {
        return fragmentSrc.replace(/%count%/gi, maxTextures + "")
            .replace(/%forloop%/gi, generateSampleSrc(maxTextures));
    }

    function generateSampleSrc(maxTextures) {
        let src = '';

        src += '\n';
        src += '\n';

        src += 'if(vTextureId <= -1.0) {';
        src += '\n\tcolor = shadowColor;';
        src += '\n}';

        for (let i = 0; i < maxTextures; i++)
        {
            src += '\nelse ';

            if(i < maxTextures-1)
            {
                src += 'if(textureId == ' + i + '.0)';
            }

            src += '\n{';
            src += '\n\tcolor = texture2D(uSamplers['+i+'], textureCoord * uSamplerSize['+i+']);';
            src += '\n}';
        }

        src += '\n';
        src += '\n';

        return src;
    }

    /// <reference path="types.d.ts" />

    let rectShaderFrag = `
varying vec2 vTextureCoord;
varying vec4 vFrame;
varying float vTextureId;
uniform vec4 shadowColor;
uniform sampler2D uSamplers[%count%];
uniform vec2 uSamplerSize[%count%];

void main(void){
   vec2 textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);
   float textureId = floor(vTextureId + 0.5);

   vec4 color;
   %forloop%
   gl_FragColor = color;
}
`;
    let rectShaderVert = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aFrame;
attribute vec2 aAnim;
attribute float aTextureId;

uniform mat3 projTransMatrix;
uniform vec2 animationFrame;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vFrame;

void main(void){
   gl_Position = vec4((projTransMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
   vec2 animCount = floor((aAnim + 0.5) / 2048.0);
   vec2 animFrameOffset = aAnim - animCount * 2048.0;
   vec2 animOffset = animFrameOffset * floor(mod(animationFrame + 0.5, animCount));

   vTextureCoord = aTextureCoord + animOffset;
   vFrame = aFrame + vec4(animOffset, animOffset);
   vTextureId = aTextureId;
}
`;

    class TilemapShader extends core.Shader {
    	__init() {this.maxTextures = 0;}

    	constructor(maxTextures, shaderVert, shaderFrag) {
    		super(
    			new core.Program(
    				shaderVert,
    				shaderFrag),
    			{
    				animationFrame: new Float32Array(2),
    				uSamplers: [],
    				uSamplerSize: [],
    				projTransMatrix: new math.Matrix()
    			}
    		);TilemapShader.prototype.__init.call(this);;
    		this.maxTextures = maxTextures;
    		fillSamplers(this, this.maxTextures);
    	}
    }

    class RectTileShader extends TilemapShader {
    	constructor(maxTextures) {
    		super(
    			maxTextures,
    			rectShaderVert,
    			generateFragmentSrc(maxTextures, rectShaderFrag)
    		);
    		fillSamplers(this, this.maxTextures);
    	}
    }

    class RectTileGeom extends core.Geometry {
    	__init2() {this.vertSize = 11;}
    	__init3() {this.vertPerQuad = 4;}
    	__init4() {this.stride = this.vertSize * 4;}
    	__init5() {this.lastTimeAccess = 0;}

    	constructor() {
    		super();RectTileGeom.prototype.__init2.call(this);RectTileGeom.prototype.__init3.call(this);RectTileGeom.prototype.__init4.call(this);RectTileGeom.prototype.__init5.call(this);;
    		const buf = this.buf = new core.Buffer(new Float32Array(2), true, false);
    		this.addAttribute('aVertexPosition', buf, 0, false, 0, this.stride, 0)
    			.addAttribute('aTextureCoord', buf, 0, false, 0, this.stride, 2 * 4)
    			.addAttribute('aFrame', buf, 0, false, 0, this.stride, 4 * 4)
    			.addAttribute('aAnim', buf, 0, false, 0, this.stride, 8 * 4)
    			.addAttribute('aTextureId', buf, 0, false, 0, this.stride, 10 * 4);
    	}

    	
    }

    /**
     * Renderer for rectangle tiles.
     */
    class TileRenderer extends core.ObjectRenderer {
    	
    	
    	__init() {this.sn = -1;}
    	__init2() {this.indexBuffer = null;}
    	__init3() {this.ibLen = 0;}
    	__init4() {this.tileAnim = [0, 0];}
    	__init5() {this.texLoc = [];}

    	
    	__init6() {this.texResources = [];}

    	constructor(renderer) {
    		super(renderer);TileRenderer.prototype.__init.call(this);TileRenderer.prototype.__init2.call(this);TileRenderer.prototype.__init3.call(this);TileRenderer.prototype.__init4.call(this);TileRenderer.prototype.__init5.call(this);TileRenderer.prototype.__init6.call(this);;
    		this.rectShader = new RectTileShader(Constant.maxTextures);
    		this.indexBuffer = new core.Buffer(undefined, true, true);
    		this.checkIndexBuffer(2000);
    		this.initBounds();
    	}

    	initBounds() {
    		if (Constant.boundCountPerBuffer <= 1) {
    			return;
    		}

    		const maxTextures = Constant.maxTextures;
    		for (let i = 0; i < maxTextures; i++) {
    			const resource = new MultiTextureResource(Constant);
    			const baseTex = new core.BaseTexture(resource);
    			baseTex.scaleMode = Constant.SCALE_MODE;
    			baseTex.wrapMode = constants.WRAP_MODES.CLAMP;
    			this.texResources.push(resource);
    		}
    	}

    	bindTexturesWithoutRT(renderer, shader, textures) {
    		let samplerSize = (shader ).uniforms.uSamplerSize;
    		this.texLoc.length = 0;
    		for (let i = 0; i < textures.length; i++) {
    			const texture = textures[i];
    			if (!texture || !texture.valid) {
    				return;
    			}
    			renderer.texture.bind(textures[i], i);
    			//TODO: add resolution here
    			samplerSize[i * 2] = 1.0 / textures[i].baseTexture.width;
    			samplerSize[i * 2 + 1] = 1.0 / textures[i].baseTexture.height;
    		}
    		(shader ).uniforms.uSamplerSize = samplerSize;
    	}

    	bindTextures(renderer, shader, textures) {
    		const len = textures.length;
    		const maxTextures = Constant.maxTextures;
    		if (len > Constant.boundCountPerBuffer * maxTextures) {
    			return;
    		}
    		if (Constant.boundCountPerBuffer <= 1) {
    			this.bindTexturesWithoutRT(renderer, shader, textures);
    			return;
    		}

    		let i = 0;
    		for (; i < len; i++) {
    			const texture = textures[i];
    			if (!texture || !texture.valid) continue;
    			const multi = this.texResources[i >> 2];
    			multi.setTexture(i & 3, texture);
    		}

    		let gltsUsed = (i + 3) >> 2;
    		for (i = 0; i < gltsUsed; i++) {
    			//remove "i, true" after resolving a bug
    			renderer.texture.bind(this.texResources[i].baseTex, i);
    		}
    	}

    	start() {
    		//sorry, nothing
    	}

    	createVb() {
    		const geom = new RectTileGeom();
    		geom.addIndex(this.indexBuffer);
    		geom.lastTimeAccess = Date.now();
    		return geom;
    	}

    	checkIndexBuffer(size, vb = null) {
    		const totalIndices = size * 6;

    		if (totalIndices <= this.ibLen) {
    			return;
    		}

    		let len = totalIndices;
    		while (len < totalIndices) {
    			len <<= 1;
    		}

    		this.ibLen = totalIndices;
    		this.indexBuffer.update((PIXI ).utils.createIndicesForQuads(size,
    			Constant.use32bitIndex ? new Uint32Array(size * 6) : undefined));

    		// 	TODO: create new index buffer instead?
    		// if (vb) {
    		// 	const curIndex = vb.getIndex();
    		// 	if (curIndex !== this.indexBuffer && (curIndex.data as any).length < totalIndices) {
    		// 		this.swapIndex(vb, this.indexBuffer);
    		// 	}
    		// }
    	}

    	// swapIndex(geom: PIXI.Geometry, indexBuf: PIXI.Buffer) {
    		// let buffers = (geom as any).buffers;
    		// const oldIndex = geom.getIndex();
    		// let ind = buffers.indexOf(oldIndex);
    		// if (ind >= 0) {
    		// 	buffers.splice(ind, 1);
    		// }
    		// geom.addIndex(indexBuf);
    	// }

    	getShader() {
    		return this.rectShader;
    	}

    	destroy() {
    		super.destroy();
    		// this.rectShader.destroy();
    		this.rectShader = null;
    	}
    }

    core.Renderer.registerPlugin('tilemap', TileRenderer );

    /// <reference path="types.d.ts" />




    class ZLayer extends display.Container {

        constructor(tilemap, zIndex) {
            super();ZLayer.prototype.__init.call(this);;
            this.tilemap = tilemap;
            this.z = zIndex;
        }

        
        
        
        
        
        
        __init() {this._lastAnimationFrame = -1;}
        

        clear() {
            let layers = this.children ;
            for (let i = 0; i < layers.length; i++)
                layers[i].clear();
            this._previousLayers = 0;
        }

        cacheIfDirty() {
            let tilemap = this.tilemap;
            let layers = this.children ;
            let modified = this._previousLayers !== layers.length;
            this._previousLayers = layers.length;
            let buf = this.canvasBuffer;
            let tempRender = this._tempRender;
            if (!buf) {
                buf = this.canvasBuffer = document.createElement('canvas');
                tempRender = this._tempRender = new (PIXI ).CanvasRenderer({width: 100, height: 100, view: buf});
                tempRender.context = tempRender.rootContext;
                tempRender.plugins.tilemap.dontUseTransform = true;
            }
            if (buf.width !== tilemap._layerWidth ||
                buf.height !== tilemap._layerHeight) {
                buf.width = tilemap._layerWidth;
                buf.height = tilemap._layerHeight;
                modified = true;
            }
            let i;
            if (!modified) {
                for (i = 0; i < layers.length; i++) {
                    if (layers[i].isModified(this._lastAnimationFrame !== tilemap.animationFrame)) {
                        modified = true;
                        break;
                    }
                }
            }
            this._lastAnimationFrame = tilemap.animationFrame;
            if (modified) {
                if (tilemap._hackRenderer) {
                    tilemap._hackRenderer(tempRender);
                }
                tempRender.context.clearRect(0, 0, buf.width, buf.height);
                for (i = 0; i < layers.length; i++) {
                    layers[i].clearModify();
                    layers[i].renderCanvas(tempRender);
                }
            }
            this.layerTransform = this.worldTransform;
            for (i = 0; i < layers.length; i++) {
                this.layerTransform = layers[i].worldTransform;
                break;
            }
        }

        renderCanvas(renderer) {
            this.cacheIfDirty();
            let wt = this.layerTransform;
            renderer.context.setTransform(
                wt.a,
                wt.b,
                wt.c,
                wt.d,
                wt.tx * renderer.resolution,
                wt.ty * renderer.resolution
            );
            let tilemap = this.tilemap;
            renderer.context.drawImage(this.canvasBuffer, 0, 0);
        }
    }

    const pixi_tilemap = {
        CanvasTileRenderer,
        CompositeRectTileLayer,
        Constant,
        GraphicsLayer,
        MultiTextureResource,
        RectTileLayer,
        TilemapShader,
        RectTileShader,
        RectTileGeom,
        TileRenderer,
        ZLayer,
    };

    exports.CanvasTileRenderer = CanvasTileRenderer;
    exports.CompositeRectTileLayer = CompositeRectTileLayer;
    exports.Constant = Constant;
    exports.GraphicsLayer = GraphicsLayer;
    exports.MultiTextureResource = MultiTextureResource;
    exports.POINT_STRUCT_SIZE = POINT_STRUCT_SIZE;
    exports.RectTileGeom = RectTileGeom;
    exports.RectTileLayer = RectTileLayer;
    exports.RectTileShader = RectTileShader;
    exports.TileRenderer = TileRenderer;
    exports.TilemapShader = TilemapShader;
    exports.ZLayer = ZLayer;
    exports.fillSamplers = fillSamplers;
    exports.generateFragmentSrc = generateFragmentSrc;
    exports.generateSampleSrc = generateSampleSrc;
    exports.pixi_tilemap = pixi_tilemap;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
if (typeof pixi_tilemap !== 'undefined') { Object.assign(this.PIXI.tilemap, pixi_tilemap); }
//# sourceMappingURL=pixi-tilemap.umd.js.map
