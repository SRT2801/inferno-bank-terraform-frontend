export interface Service {
  id: number;
  categoria: string;
  proveedor: string;
  servicio: string;
  plan: string;
  precioMensual: string;
  velocidadDetalles: string;
  estado: string;
}

export interface ApiResponse {
  message: string;
  response: {
    action: string;
    key: string;
    data: {
      items: Service[];
      file: {
        url: string;
        s3Key: string;
        filename: string;
        mimetype: string;
        uploadedAt: string;
      };
    };
  };
}
