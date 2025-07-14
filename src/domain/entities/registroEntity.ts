class RegistroEntity {
  constructor(
    public id: number,
    public comentario: string,
    public accionId: number,
    public fecha: Date
  ) {}

  esReciente(): boolean {
    const hoy = new Date();
    const diferencia = hoy.getTime() - this.fecha.getTime();
    return diferencia < 7 * 24 * 60 * 60 * 1000; // Menos de una semana
  }
}

export default RegistroEntity;
