"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const conexion_1 = __importDefault(require("../Utils/conexion"));
class Admin {
    static login(correo, contrasena) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_login_admin', { p_correo: correo, p_contrasena: contrasena });
            if (error)
                throw error;
            return data;
        });
    }
    static DetalleOrdenProdcuto(idFactura) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_get_detalle_orden_productos', {
                p_id_factura: idFactura
            });
            if (error)
                throw error;
            return data;
        });
    }
    static DetalleOrdenCliente(idFactura) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_get_detalle_orden_cliente', {
                p_id_factura: idFactura
            });
            if (error)
                throw error;
            return data;
        });
    }
    static ObtenerOrdenes(idEstado, columna_ordenamiento, direccion_ordenamiento) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_get_todas_las_ordenes', {
                p_id_estado_fact: idEstado,
                p_orden_columna: columna_ordenamiento,
                p_orden_direccion: direccion_ordenamiento
            });
            if (error)
                throw error;
            return data;
        });
    }
    static ObtenerEstadosFactura() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_obtener_estados_fact');
            if (error) {
                throw error;
            }
            return data;
        });
    }
    static ActualizarEstadoOrden(idOrden, idNuevoEstado) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_cambiar_estado_orden', {
                p_id_factura: idOrden,
                p_id_estado_fact: idNuevoEstado
            });
            if (error) {
                throw error;
            }
            return data;
        });
    }
    static Obtener_todos_los_productos_admin() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_obtener_todos_los_productos_admin');
            if (error) {
                throw error;
            }
            return data;
        });
    }
    static Obtener_productos_por_categoria_admin(IdCategoria) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_obtener_productos_por_categoria_admin', {
                p_id_categoria: IdCategoria
            });
            if (error) {
                throw error;
            }
            return data;
        });
    }
    static CrearProductoSinTallas(nombre_prod, precio, cantidad, descripcion, categorias, keywords, imagen_principal, imagen_miniaturas) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_create_producto', {
                p_nombre_prod: nombre_prod,
                p_precio: precio,
                p_cantidad_total: cantidad,
                p_descripcion: descripcion,
                p_categorias: categorias,
                p_keywords: keywords,
                p_url_imagen_principal: imagen_principal,
                p_url_imagen_miniaturas: imagen_miniaturas
            });
            if (error) {
                throw new Error(`Error al crear el producto: ${error.message}`);
            }
            return data;
        });
    }
    static CrearProductoConTallas(nombre_prod, descripcion, categorias, keywords, imagen_principal, imagen_miniaturas, size_quantities, size_prices) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield conexion_1.default.rpc('p_create_producto_talla', {
                    p_nombre_prod: nombre_prod, // Convertir ID de tipo a número
                    p_descripcion: descripcion,
                    p_categorias: categorias,
                    p_keywords: keywords,
                    p_url_imagen_principal: imagen_principal, // Default a un array vacío si es null
                    p_size_quantities: size_quantities, // Objeto JSON con cantidades por talla
                    p_size_prices: size_prices,
                    p_url_imagen_miniaturas: imagen_miniaturas, // Objeto JSON con precios por talla
                });
                // Manejo de errores
                if (error) {
                    throw new Error(`Error al crear el producto: ${error.message}`);
                }
                // Validar si el procedimiento almacenado devolvió un mensaje de éxito o error
                if (data.codigo !== 1) {
                    throw new Error(`Procedimiento falló: ${data.mensaje}`);
                }
                return {
                    codigo: data.codigo,
                    mensaje: data.mensaje,
                    productoCreado: data.query_result,
                };
            }
            catch (error) {
                console.error(error.message);
                throw new Error(`Error inesperado: ${error.message}`);
            }
        });
    }
    static ActualizarProductoConTallas(id_producto, nombre_prod, descripcion, categorias, keywords, url_imagen_principal, url_imagen_miniaturas, size_quantities, size_prices) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id_producto, nombre_prod, descripcion, categorias, keywords, url_imagen_principal, size_quantities, size_prices, url_imagen_miniaturas);
                const { data, error } = yield conexion_1.default.rpc('p_update_producto_talla', {
                    p_id_producto: id_producto,
                    p_nombre_prod: nombre_prod,
                    p_descripcion: descripcion,
                    p_categorias: categorias,
                    p_keywords: keywords,
                    p_url_imagen_principal: url_imagen_principal,
                    p_size_quantities: size_quantities,
                    p_size_prices: size_prices,
                    p_url_imagen_miniaturas: url_imagen_miniaturas,
                });
                if (error) {
                    throw new Error(`Error al actualizar el producto con tallas: ${error.message}`);
                }
                if (data.codigo !== 1) {
                    throw new Error(`Procedimiento falló: ${data.mensaje}`);
                }
                return {
                    codigo: data.codigo,
                    mensaje: data.mensaje,
                    productoActualizado: data.query_result,
                };
            }
            catch (error) {
                console.error(error.message);
                throw new Error(`Error inesperado: ${error.message}`);
            }
        });
    }
    static CrearMaterialSinTallas(nombre_material, precio, cantidad, descripcion, categoria, keywords, marca, imagen_principal, imagen_miniaturas) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_create_material_sintallas', {
                p_nombre_material: nombre_material,
                p_precio: precio,
                p_cantidad_total: cantidad,
                p_descripcion: descripcion,
                p_categoria: categoria,
                p_keywords: keywords,
                p_marca: marca,
                p_url_imagen_principal: imagen_principal,
                p_url_imagen_miniaturas: imagen_miniaturas, // Enviamos null si no hay miniaturas
            });
            if (error) {
                throw new Error(`Error al crear el material: ${error.message}`);
            }
            return data;
        });
    }
    static CrearMaterialConGrosor(nombre_material, descripcion, marca, imagen_principal, imagen_miniaturas, // Opcional, por defecto vacío
    keywords, size_quantities, // JSON de cantidades por grosor
    size_prices // JSON de precios por grosor
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield conexion_1.default.rpc('p_create_material_grosor', {
                    p_nombre_material: nombre_material,
                    p_descripcion: descripcion,
                    p_marca: marca,
                    p_url_imagen_principal: imagen_principal,
                    p_keywords: keywords,
                    p_size_quantities: size_quantities, // Cantidades por grosor
                    p_size_prices: size_prices, // Precios por grosor
                    p_url_imagen_miniaturas: imagen_miniaturas, // Miniaturas (opcional)
                });
                if (error) {
                    throw new Error(`Error al crear el material: ${error.message}`);
                }
                // Verificar el resultado del procedimiento
                if (data.codigo !== 1) {
                    throw new Error(`Procedimiento falló: ${data.mensaje}`);
                }
                return {
                    codigo: data.codigo,
                    mensaje: data.mensaje,
                    producto: data.query_result,
                };
            }
            catch (error) {
                console.error(error.message);
                throw new Error(`Error inesperado: ${error.message}`);
            }
        });
    }
    static ObtenerProductoInfo(IdProducto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('get_producto_admin', {
                p_id_producto: IdProducto,
            });
            if (error) {
                throw error;
            }
            return data;
        });
    }
    static ActualizarProductoSinTalla(id_producto, nombre_prod, precio, cantidad_total, descripcion, categorias, keywords, url_imagen_principal, url_imagen_miniaturas) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("keywords", keywords);
                const { data, error } = yield conexion_1.default.rpc('p_update_producto', {
                    p_id_producto: id_producto,
                    p_nombre_prod: nombre_prod,
                    p_precio: precio,
                    p_cantidad_total: cantidad_total,
                    p_descripcion: descripcion,
                    p_categorias: categorias,
                    p_keywords: keywords,
                    p_url_imagen_principal: url_imagen_principal,
                    p_url_imagen_miniaturas: url_imagen_miniaturas,
                });
                if (error) {
                    throw new Error(`Error al actualizar el producto: ${error.message}`);
                }
                // Verificar el resultado del procedimiento
                if (data.codigo !== 1) {
                    throw new Error(`Procedimiento falló: ${data.mensaje}`);
                }
                return {
                    codigo: data.codigo,
                    mensaje: data.mensaje,
                    productoActualizado: data.query_result,
                };
            }
            catch (error) {
                console.error(error.message);
                throw new Error(`Error inesperado: ${error.message}`);
            }
        });
    }
    static ActualizarMaterialSinTallas(id_material, nombre_material, precio, cantidad, descripcion, categoria, keywords, marca, url_imagen_principal, url_imagen_miniaturas) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("keywords", keywords);
                const { data, error } = yield conexion_1.default.rpc('p_update_material_sintallas', {
                    p_id_material: id_material,
                    p_nombre_material: nombre_material,
                    p_precio: precio,
                    p_cantidad_total: cantidad,
                    p_descripcion: descripcion,
                    p_categoria: categoria,
                    p_keywords: keywords,
                    p_marca: marca,
                    p_url_imagen_principal: url_imagen_principal,
                    p_url_imagen_miniaturas: url_imagen_miniaturas,
                });
                if (error) {
                    throw new Error(`Error al actualizar el material: ${error.message}`);
                }
                // Verificar el resultado del procedimiento
                if (data.codigo !== 1) {
                    throw new Error(`Procedimiento falló: ${data.mensaje}`);
                }
                return {
                    codigo: data.codigo,
                    mensaje: data.mensaje,
                    materialActualizado: data.query_result,
                };
            }
            catch (error) {
                console.error(error.message);
                throw new Error(`Error inesperado: ${error.message}`);
            }
        });
    }
    static ActualizarMaterialConGrosor(id_material, nombre_material, descripcion, marca, imagen_principal, imagen_miniaturas, // Opcional
    keywords, size_quantities, // JSON de cantidades por grosor
    size_prices // JSON de precios por grosor
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield conexion_1.default.rpc('p_update_material_grosor', {
                    p_id_material: id_material,
                    p_nombre_material: nombre_material,
                    p_descripcion: descripcion,
                    p_marca: marca,
                    p_url_imagen_principal: imagen_principal,
                    p_keywords: keywords,
                    p_size_quantities: size_quantities, // Cantidades por grosor
                    p_size_prices: size_prices, // Precios por grosor
                    p_url_imagen_miniaturas: imagen_miniaturas, // Miniaturas
                });
                if (error) {
                    throw new Error(`Error al actualizar el material: ${error.message}`);
                }
                // Verificar el resultado del procedimiento
                if (data.codigo !== 1) {
                    throw new Error(`Procedimiento falló: ${data.mensaje}`);
                }
                return {
                    codigo: data.codigo,
                    mensaje: data.mensaje,
                    materialActualizado: data.query_result,
                };
            }
            catch (error) {
                console.error(error.message);
                throw new Error(`Error inesperado: ${error.message}`);
            }
        });
    }
    // static async DeleteProducto(id_producto:number, correo: string,contrasena: string){
    // const { data, error } = await supabase.rpc('p_delete_producto', {p_id_prod: id_producto,p_correo: correo, p_contrasena: contrasena });
    // if (error) throw error;
    // return {
    //     codigo: data.codigo,
    //     mensaje: data.mensaje
    // };
    // }
    static DeleteProducto(id_producto, p_correo) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_delete_producto', { p_id_prod: id_producto, p_correo: p_correo });
            if (error)
                throw error;
            return {
                codigo: data.codigo,
                mensaje: data.mensaje
            };
        });
    }
    static OrdenesRangoFecha(min_fecha, max_fecha) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_get_todas_las_ordenes_por_fecha', {
                p_fecha_min: min_fecha,
                p_fecha_max: max_fecha
            });
            if (error) {
                throw error;
            }
            return data;
        });
    }
    static CrearKit(nombre_prod, precio, cantidad_total, descripcion, categorias, keywords, url_patron, url_imagen_principal, url_imagen_miniaturas, url_tutorial) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_create_kit', {
                p_nombre_prod: nombre_prod,
                p_precio: precio,
                p_cantidad_total: cantidad_total,
                p_descripcion: descripcion,
                p_categorias: categorias,
                p_keywords: keywords,
                p_url_patron: url_patron,
                p_url_imagen_principal: url_imagen_principal,
                p_url_imagen_miniaturas: url_imagen_miniaturas,
                p_url_tutorial: url_tutorial,
            });
            ;
            if (error) {
                throw new Error(`Error al crear el kit: ${error.message}`);
            }
            return data;
        });
    }
    static Updatekit(id_producto, nombre_prod, precio, cantidad_total, descripcion, categorias, keywords, url_patron, url_imagen_principal, url_imagen_miniaturas, url_tutorial) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_update_kit', {
                p_id_producto: id_producto,
                p_nombre_prod: nombre_prod,
                p_precio: precio,
                p_cantidad_total: cantidad_total,
                p_descripcion: descripcion,
                p_categorias: categorias,
                p_keywords: keywords,
                p_url_patron: url_patron,
                p_url_imagen_principal: url_imagen_principal,
                p_url_imagen_miniaturas: url_imagen_miniaturas,
                p_url_tutorial: url_tutorial,
            });
            if (error) {
                throw new Error(`Error al update del kit: ${error.message}`);
            }
            return data;
        });
    }
    static createPDF(nombre_archivo, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield conexion_1.default.rpc('p_insert_pdf', {
                p_nombre_archivo: nombre_archivo,
                p_url: url
            });
            if (error) {
                throw error;
            }
            return data;
        });
    }
}
exports.Admin = Admin;
