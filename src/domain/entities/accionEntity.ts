class AccionEntity {
  constructor(
    public id: number,
    public nombre: string,
    public descripcion: string,
    public climaId: number,
    public humedad: number,
    public velocidadViento: number
  ) {}

  esAccionValida(): boolean {
    return this.humedad < 80 && this.velocidadViento < 20;
  }
}

export default AccionEntity;
