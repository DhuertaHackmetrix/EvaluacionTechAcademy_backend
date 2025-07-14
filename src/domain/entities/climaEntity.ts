class ClimaEntity {
  constructor(
    public id: number,
    public nombre: string,
    public descripcion: string,
    public temperatura: number,
    public humedad: number,
    public velocidadViento: number
  ) {}

  esCalido(): boolean {
    return this.temperatura > 25;
  }

  esHumedo(): boolean {
    return this.humedad > 70;
  }
}

export default ClimaEntity;
