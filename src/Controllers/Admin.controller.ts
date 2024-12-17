import { Request, Response  } from 'express';
import { Admin } from '../Models/Admin.model'
import express from 'express';
import imagekit from '../Utils/imageKitConfig';
import DriveUploader from '../../uploads/uploadToDrive';



interface MulterRequest extends Request {
  file?: Express.Multer.File; // Aquí hacemos 'file' opcional
}

export const uploadImage = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const file = req.file; 
    const fileName = file?.originalname; 

    if (!file) {
      res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
      return;  
    }

    // Convertir el archivo a base64
    const base64File = file.buffer.toString('base64');

    const folderPath = '/Fotos'; // 

    const response = await imagekit.upload({
      file: base64File, // Archivo en base64
      fileName: fileName || 'default_image_name.jpg', // Nombre del archivo
      folder: folderPath, // Carpeta donde se almacenará la imagen
    });

    const imageUrl = response.url; // La URL de la imagen almacenada

    console.log('Imagen subida con éxito. URL:', imageUrl); 

    res.status(200).json({ imageUrl: imageUrl });

  } catch (error) {
    console.error('Error al subir la imagen:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
};


export const LoginAdmin = async (req: Request, res: Response) => {
  const {correo,contrasena } = req.body;
  try{
      const admin = await Admin.login(correo,contrasena);
      res.status(201).json({ 
        admin
    });
  }catch(error: any){
        console.log("error con login", error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }

}

export const DetalleOrdenProdcuto = async (req: Request, res: Response) => {
  const {IdOrden} = req.params;
  try{
      const DetalleOrden = await Admin.DetalleOrdenProdcuto(Number(IdOrden));
      res.status(201).json({
        DetalleOrden
      })
  }catch(error: any){
    console.log("error fetch detalle orden ", error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }

}

export const DetalleOrdenCliente = async (req: Request, res: Response) => {
  const {IdOrden} = req.params;
  try{
      const DetalleOrdenCliente = await Admin.DetalleOrdenCliente(Number(IdOrden));
      res.status(201).json({
        DetalleOrdenCliente
      })
  }catch(error: any){
    console.log("error fetch detalle del con su orden ", error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }

}

export const ObtenerOrdenes = async (req: Request, res: Response) =>{
  const{idEstado,columna_ordenamiento,
      direccion_ordenamiento} = req.body

    try{
        const ordenes = await Admin.ObtenerOrdenes(idEstado,columna_ordenamiento,direccion_ordenamiento);
        res.status(201).json({
          ordenes
        })
    }catch(error: any){
      console.log("error fetch de ordenes ", error);
      res.status(500).json({ message: 'Error en el servidor', error });
    }
}


export const ObtenerEstdosFactura = async (req: Request, res: Response) => {
  try {
      const Estados = await Admin.ObtenerEstadosFactura();

      res.status(201).json({
        Estados
      });
  }
  catch (error) {
      console.log('error con fetch de Estados de factura', error);
      res.status(500).json({ message: 'algo paso mal :(', error });
  }
}

export const ActualizarEstadoOrden = async (req: Request, res: Response) => {
  const {IdOrden} = req.params;
  const{IdNuevoEstado} = req.body

  try{
      const UpdatedOrden = await Admin.ActualizarEstadoOrden(Number(IdOrden),IdNuevoEstado)
      res.status(201).json({
        UpdatedOrden
      });
  }catch (error) {
      console.log('error con actualizacion de Estados de factura', error);
      res.status(500).json({ message: 'algo paso mal :(', error });
  }
}


export const Obtener_productos_admin = async (req: Request, res: Response) => {
  try {
      const productos = await Admin.Obtener_todos_los_productos_admin();

      res.status(201).json({
        productos
      });
  }
  catch (error) {
      console.log('error con fetch de productos', error);
      res.status(500).json({ message: 'algo paso mal :(', error });
  }
}

export const Obtener_productos_por_categoria_admin = async (req: Request, res: Response) => {
  const {IdCategoria} = req.params;
  
  try {
      const productosConCategoria = await Admin.Obtener_productos_por_categoria_admin(Number(IdCategoria));

      res.status(201).json({
        productosConCategoria
      });
  }
  catch (error) {
      console.log('error con fetch de productos con categorias', error);
      res.status(500).json({ message: 'algo paso mal :(', error });
  }
}
export const CrearProductoSinTallas = async (req: Request, res: Response) => {
  const {
    productName,
    price,
    stock,
    description,
    categories,
    keywords,
    mainImage,
    galleryImages
  } = req.body;
  
    try {
    const NewProduct = await Admin.CrearProductoSinTallas(
      productName,
      price,
      stock,
      description,
      categories,
      keywords,
      mainImage,
      galleryImages
    );
    res.status(201).json({
      NewProduct
    });
  } catch (error) {
    console.log('Error con la creación del producto', error);
    res.status(500).json({ message: 'Error con la creación del producto', error });
  }
};

export const CrearProductoConTallas = async (req: Request, res: Response) => {
  const {
    productName,
    description,
    categories,
    keywords,
    mainImage,
    galleryImages,
    sizeQuantities,
    sizePrices,
  } = req.body;

  
  try {
    // Llamar al método definido en la clase Admin
    const NewProduct = await Admin.CrearProductoConTallas(
      productName,
      description,
      categories,
      keywords,
      mainImage,
      galleryImages,
      sizeQuantities,
      sizePrices
    );

    // Respuesta exitosa
    res.status(201).json({
      NewProduct,
    });
  } catch (error: any) {
    // Respuesta con error
    res.status(500).json({
      message: 'Error al crear el producto',
      error: error.message,
    });
  }
};

export const CrearMaterialSinTallas = async (req: Request, res: Response) => {
  const {
    productName,
    price,
    stock,
    description,
    categoryId,
    keywords,
    marca,
    mainImage,
    galleryImages
  } = req.body;
  

  try {
    const NewMaterial = await Admin.CrearMaterialSinTallas(
      productName,
      price,
      stock,
      description,
      categoryId,
      keywords,
      marca,
      mainImage,
      galleryImages
    );
    res.status(201).json({
      NewMaterial
    });
  } catch (error) {
    console.log('Error con la creación del material', error);
    res.status(500).json({ message: 'Error con la creación del material', error });
  }
};

export const CrearMaterialConGrosor = async (req: Request, res: Response) => {
  const {
    productName,
    description,
    marca,
    mainImage,
    galleryImages,
    keywords,
    sizeQuantities,
    sizePrices
  } = req.body;
  
  try {
    const NewMaterial = await Admin.CrearMaterialConGrosor(
      productName,
      description,
      marca,
      mainImage,
      galleryImages,
      keywords,
      sizeQuantities,
      sizePrices
    );
    res.status(201).json({
      NewMaterial
    });
  } catch (error) {
    console.log('Error con la creación del material', error);
    res.status(500).json({ message: 'Error con la creación del material', error });
  }
};

export const ObtenerProductoAdmin = async (req: Request, res: Response) => {
  const { IdProducto } = req.params;

  try {
      const productoInfo = await Admin.ObtenerProductoInfo(Number(IdProducto));

      res.status(200).json({
          productoInfo,
      });
  } catch (error) {
      console.error('Error al obtener información del producto:', error);
      res.status(500).json({ message: 'Ocurrió un error al obtener la información del producto', error });
  }
};

export const ActualizarProductoSinTallas = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const {
    productName,
    price,
    stock,
    description,
    categories,
    keywords,
    mainImage,
    galleryImages
  } = req.body;
  
  try {
    const updatedProduct = await Admin.ActualizarProductoSinTalla(
      parseInt(productId),
      productName,
      price,
      stock,
      description,
      categories,
      keywords,
      mainImage,
      galleryImages
    );

    res.status(200).json({
      updatedProduct
    });
  } catch (error) {
    console.log('Error con la actualización del producto sin tallas', error);
    res.status(500).json({ message: 'Error con la actualización del producto sin tallas', error });
  }
};

export const ActualizarProductoConTallas = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const {
    productName,
    description,
    categories,
    keywords,
    mainImage,
    galleryImages,
    sizeQuantities,
    sizePrices,
  } = req.body;

    

  try {
    const updatedProduct = await Admin.ActualizarProductoConTallas(
      parseInt(productId),
      productName,
      description,
      categories,
      keywords,
      mainImage,
      galleryImages,
      sizeQuantities,
      sizePrices
    );

    res.status(200).json({
      codigo: updatedProduct.codigo,
      updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error al actualizar el producto con tallas ',
      error: error.message,
    });
  }
};

export const ActualizarMaterialSinTallas = async (req: Request, res: Response) => {
  const { materialId } = req.params;
  const {
    productName,
    price,
    stock,
    description,
    categoryId,
    keywords,
    marca,
    mainImage,
    galleryImages
  } = req.body;
  
  try {
    const updatedMaterial = await Admin.ActualizarMaterialSinTallas(
      parseInt(materialId),
      productName,
      price,
      stock,
      description,
      categoryId,
      keywords,
      marca,
      mainImage,
      galleryImages
    );
    res.status(200).json({
      updatedMaterial
    });
  } catch (error) {
    console.log('Error con la actualización del material sin tallas', error);
    res.status(500).json({ message: 'Error con la actualización del material sin tallas', error });
  }
};

export const ActualizarMaterialConGrosor = async (req: Request, res: Response) => {
  const { materialId } = req.params;
  const {
    productName,
    description,
    marca,
    mainImage,
    galleryImages,
    keywords,
    sizeQuantities,
    sizePrices
  } = req.body;

  

  try {
    const updatedMaterial = await Admin.ActualizarMaterialConGrosor(
      parseInt(materialId),
      productName,
      description,
      marca,
      mainImage,
      galleryImages,
      keywords,
      sizeQuantities,
      sizePrices
    );
    res.status(200).json({
      updatedMaterial
    });
  } catch (error) {
    console.log('Error con la actualización del material con grosor', error);
    res.status(500).json({ message: 'Error con la actualización del material con grosor', error });
  }
};

// export const DeleteProducto = async (req: Request, res: Response) => {
//   const {correo,contrasena } = req.body;
//   const{IdProducto} = req.params;
//   try{
//       const deleteProduct = await Admin.DeleteProducto(parseInt(IdProducto),correo,contrasena);
//       res.status(201).json({ 
//         deleteProduct
//     });
//   }catch(error: any){
//         console.log("error al borrar producto", error);
//         res.status(500).json({ message: 'Error en el servidor', error });
//     }

// }

export const DeleteProducto = async (req: Request, res: Response) => {
  const {correo} = req.body;
  const{IdProducto} = req.params;
  try{
      const deleteProduct = await Admin.DeleteProducto(parseInt(IdProducto), correo);
      res.status(201).json({ 
        deleteProduct
    });
  }catch(error: any){
        console.log("error al borrar producto", error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }

}

export const FiltrarFechasRango = async (req: Request, res: Response) =>{
  const{p_fecha_min, p_fecha_max}=req.body
  try{
        const ordenes = await Admin.OrdenesRangoFecha(p_fecha_min,p_fecha_max);
        res.status(201).json({
          ordenes
        })
  }catch(error: any){
    console.log("error al obtener las ordenes", error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
}

export const CreateKit = async (req: Request, res: Response) =>{
  const{
    nombre_prod,
    precio,
    cantidad_total,
    descripcion,
    categorias,
    keywords,
    url_patron,
    url_imagen_principal,
    url_imagen_miniaturas,
    url_tutorial
  }=req.body

  try{
    const kit = await Admin.CrearKit(
      nombre_prod,
      precio,
      cantidad_total,
      descripcion,
      categorias,
      keywords,
      url_patron,
      url_imagen_principal,
      url_imagen_miniaturas,
      url_tutorial);
      res.status(201).json({
        kit
      })
  }catch(error: any){
    console.log("error al crear Kit", error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
}

export const UpdateKit = async (req: Request, res: Response) =>{
  const{id_producto}=req.params
  const{
    nombre_prod,
    precio,
    cantidad_total,
    descripcion,
    categorias,
    keywords,
    url_patron,
    url_imagen_principal,
    url_imagen_miniaturas,
    url_tutorial
  }=req.body
  try{
    const UpdatedKit = await Admin.Updatekit(
      Number(id_producto),
      nombre_prod,
      precio,
      cantidad_total,
      descripcion,
      categorias,
      keywords,
      url_patron,
      url_imagen_principal,
      url_imagen_miniaturas,
      url_tutorial);
      res.status(201).json({
        UpdatedKit
      })
  }catch(error: any){
    console.log("error al actualizar Kit", error);
    res.status(500).json({ message: 'Error en el servidor',error});
  }
}

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No se proporcionó ningún archivo' });
    return; // Asegúrate de terminar la ejecución con `return`
  }
  const {nombre_archivo} = req.body
  const uploader = new DriveUploader();

  try {
    const fileId = await uploader.uploadPDF(req.file);
    
    // Obtener la URL del archivo con el permiso para "Cualquiera con el enlace"
    const fileUrl = uploader.getFileUrl(fileId);
    const registroPDF = await Admin.createPDF(nombre_archivo,fileUrl)
    res.status(200).json({
      message: 'Archivo subido exitosamente',
      fileId: fileId,
      fileUrl: fileUrl, // Retorna la URL del archivo con el enlace compartido
      registroPDF
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al subir el archivo',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};




