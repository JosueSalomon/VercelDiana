import  supabase  from '../Utils/conexion';
import fs from 'fs';
import Busboy from 'busboy';


export class Admin{
    static async login(correo: string,contrasena: string){
        const { data, error } = await supabase.rpc('p_login_admin', {p_correo: correo, p_contrasena: contrasena });
        if (error) throw error;
        return data;
    }

    static async DetalleOrdenProdcuto(idFactura: number){
            const {data, error} = await supabase.rpc('p_get_detalle_orden_productos',{
                p_id_factura: idFactura
            });
            if (error) throw error;
            return data;
    }

    static async DetalleOrdenCliente(idFactura: number){
        const {data, error} = await supabase.rpc('p_get_detalle_orden_cliente',{
            p_id_factura: idFactura
        });
        if (error) throw error;
        return data;
    }

    static async ObtenerOrdenes(
        idEstado: number, columna_ordenamiento: string,
        direccion_ordenamiento: string ){
        const {data, error} = await supabase.rpc('p_get_todas_las_ordenes',{
            p_id_estado_fact: idEstado,
            p_orden_columna: columna_ordenamiento,
            p_orden_direccion: direccion_ordenamiento
        });
        if (error) throw error;
        return data;
    }

    static async ObtenerEstadosFactura(){
        const{data, error} = await supabase.rpc('p_obtener_estados_fact');
        if(error){
            throw error;
        }
        return data;
    }


    static async ActualizarEstadoOrden(idOrden: number, idNuevoEstado: number){
        const{data, error} = await supabase.rpc('p_cambiar_estado_orden',{
            p_id_factura: idOrden,
            p_id_estado_fact: idNuevoEstado
        });
        if(error){
            throw error;
        }
        return data;
    }

    static async Obtener_todos_los_productos_admin(){
        const{data, error} = await supabase.rpc('p_obtener_todos_los_productos_admin');
        if(error){
            throw error;
        }
        return data;
    }

    static async Obtener_productos_por_categoria_admin(IdCategoria: number){
        const{data, error} = await supabase.rpc('p_obtener_productos_por_categoria_admin',{
            p_id_categoria: IdCategoria
        });
        if(error){
            throw error;
        }
        return data;
    }

    static async CrearProductoSinTallas(
        nombre_prod: string,
        precio: number,
        cantidad: number,
        descripcion: string,
        categorias: number[],
        keywords: string[],
        imagen_principal: string, 
        imagen_miniaturas: string[], 
    ) {
        const { data, error } = await supabase.rpc('p_create_producto', {
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
    }

    static async CrearProductoConTallas(
        nombre_prod: string,
        descripcion: string,
        categorias: number[],
        keywords: string[],
        imagen_principal: string,
        imagen_miniaturas: string[],
        size_quantities: Record<string, number | null>,
        size_prices: Record<string, number | null>
    ) {
        try {
            const { data, error } = await supabase.rpc('p_create_producto_talla', {
                p_nombre_prod: nombre_prod, // Convertir ID de tipo a número
                p_descripcion: descripcion,
                p_categorias: categorias,
                p_keywords: keywords,
                p_url_imagen_principal: imagen_principal,// Default a un array vacío si es null
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
                codigo:data.codigo,
                mensaje: data.mensaje,
                productoCreado: data.query_result,
            };
        } catch (error: any) {
            console.error(error.message);
            throw new Error(`Error inesperado: ${error.message}`);
        }
    }

    static async ActualizarProductoConTallas(
        id_producto: number,
        nombre_prod: string,
        descripcion: string,
        categorias: number[],
        keywords: string[],
        url_imagen_principal: string,
        url_imagen_miniaturas: string[],
        size_quantities: Record<string, number | null>,
        size_prices: Record<string, number | null>,
    ) {
        try {
            console.log(
                id_producto,
                nombre_prod,
                descripcion,
                categorias,
                keywords,
                url_imagen_principal,
                size_quantities,
                size_prices,
                url_imagen_miniaturas
            );
            const { data, error } = await supabase.rpc('p_update_producto_talla', {
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
                codigo:data.codigo,
                mensaje: data.mensaje,
                productoActualizado: data.query_result,
            };
        } catch (error: any) {
            console.error(error.message);
            throw new Error(`Error inesperado: ${error.message}`);
        }
    }
    


    static async CrearMaterialSinTallas(
        nombre_material: string,
        precio: number,
        cantidad: number,
        descripcion: string,
        categoria: number,
        keywords: string[],
        marca: string,
        imagen_principal: string,
        imagen_miniaturas: string[], // Aquí aceptamos null o un arreglo de strings
    ) {
        const { data, error } = await supabase.rpc('p_create_material_sintallas', {
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
    }


    static async CrearMaterialConGrosor(
        nombre_material: string,
        descripcion: string,
        marca: string,
        imagen_principal: string,
        imagen_miniaturas: string[], // Opcional, por defecto vacío
        keywords: string[],
        size_quantities: Record<string, number | null>, // JSON de cantidades por grosor
        size_prices: Record<string, number | null> // JSON de precios por grosor
            ){
        try {
        const { data, error } = await supabase.rpc('p_create_material_grosor', {
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
        } catch (error: any) {
            console.error(error.message);
            throw new Error(`Error inesperado: ${error.message}`);
        }
    }

    static async ObtenerProductoInfo(IdProducto: number) {
        const { data, error } = await supabase.rpc('get_producto_admin', {
            p_id_producto: IdProducto,
        });
    
        if (error) {
            throw error;
        }
    
        return data;
    }

    static async ActualizarProductoSinTalla(
        id_producto: number,
        nombre_prod: string,
        precio: number,
        cantidad_total: number,
        descripcion: string,
        categorias: number[],
        keywords: string[],
        url_imagen_principal: string,
        url_imagen_miniaturas: string[]
    ) {
        try {
            console.log("keywords", keywords)
            const { data, error } = await supabase.rpc('p_update_producto', {
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
        } catch (error: any) {
            console.error(error.message);
            throw new Error(`Error inesperado: ${error.message}`);
        }
    }

    


    static async ActualizarMaterialSinTallas(
        id_material: number,
        nombre_material: string,
        precio: number,
        cantidad: number,
        descripcion: string,
        categoria: number,
        keywords: string[],
        marca: string,
        url_imagen_principal: string,
        url_imagen_miniaturas: string[]
    ) {
        try {
            console.log("keywords", keywords)
            const { data, error } = await supabase.rpc('p_update_material_sintallas', {
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
        } catch (error: any) {
            console.error(error.message);
            throw new Error(`Error inesperado: ${error.message}`);
        }
    }
    
    static async ActualizarMaterialConGrosor(
        id_material: number,
        nombre_material: string,
        descripcion: string,
        marca: string,
        imagen_principal: string,
        imagen_miniaturas: string[], // Opcional
        keywords: string[],
        size_quantities: Record<string, number | null>, // JSON de cantidades por grosor
        size_prices: Record<string, number | null> // JSON de precios por grosor
    ) {
        try {
            const { data, error } = await supabase.rpc('p_update_material_grosor', {
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
        } catch (error: any) {
            console.error(error.message);
            throw new Error(`Error inesperado: ${error.message}`);
        }
    }

    // static async DeleteProducto(id_producto:number, correo: string,contrasena: string){
    // const { data, error } = await supabase.rpc('p_delete_producto', {p_id_prod: id_producto,p_correo: correo, p_contrasena: contrasena });
    // if (error) throw error;
    // return {
    //     codigo: data.codigo,
    //     mensaje: data.mensaje
    // };
    // }

    static async DeleteProducto(id_producto:number, p_correo:string){
    const { data, error } = await supabase.rpc('p_delete_producto', {p_id_prod: id_producto, p_correo: p_correo});
    if (error) throw error;
    return {
        codigo: data.codigo,
        mensaje: data.mensaje
    };
    }
    
    static async OrdenesRangoFecha(min_fecha: string, max_fecha: string){
        const { data, error } = await supabase.rpc('p_get_todas_las_ordenes_por_fecha',{
            p_fecha_min: min_fecha,
            p_fecha_max: max_fecha
        });
        if(error){
            throw error;
        }
        return data;
    }
    
    static async CrearKit(
        nombre_prod: string,
        precio: number,
        cantidad_total: number,
        descripcion: string,
        categorias: number[],
        keywords:string[] ,
        url_patron: string,
        url_imagen_principal: string ,
        url_imagen_miniaturas:string[] ,
        url_tutorial: string
    ){
        const { data, error } = await supabase.rpc('p_create_kit',{
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
    }

    static async Updatekit(
        id_producto: number,
        nombre_prod: string,
        precio: number,
        cantidad_total: number,
        descripcion: string,
        categorias: number[],
        keywords:string[],
        url_patron: string,
        url_imagen_principal: string ,
        url_imagen_miniaturas:string[] ,
        url_tutorial: string
    ){
        const { data, error } = await supabase.rpc('p_update_kit',{
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

    }


    static async createPDF(nombre_archivo: string, url: string){
        const{data, error} = await supabase.rpc('p_insert_pdf',{
            p_nombre_archivo: nombre_archivo,
            p_url: url
        });
        if(error){
            throw error;
        }
        return data;
    }


}