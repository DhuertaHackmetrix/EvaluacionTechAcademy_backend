import EmailService from '../application/services/emailService';
import ClimaService from '../application/services/climaService';
import AccionService from '../application/services/accionService';
import RegistroService from '../application/services/registroService';
import sgMail from '@sendgrid/mail';
import { IClimaRepository } from '../domain/repositories/climaRepository';
import { IAccionRepository } from '../domain/repositories/accionRepository';
import { IRegistroRepository } from '../domain/repositories/registroRepository';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

jest.mock('../application/services/climaService');
jest.mock('../application/services/accionService');
jest.mock('../application/services/registroService');

describe('EmailService', () => {
  let emailService: EmailService;
  let mockClimaService: jest.Mocked<ClimaService>;
  let mockAccionService: jest.Mocked<AccionService>;
  let mockRegistroService: jest.Mocked<RegistroService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    const mockClimaRepository: jest.Mocked<IClimaRepository> = {
      obtenerClimaActual: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findAccionesByClimaId: jest.fn(),
    };
    const mockAccionRepository: jest.Mocked<IAccionRepository> = {
        crearAccion: jest.fn(),
        leerAccion: jest.fn(),
        deleteAccion: jest.fn(),
        updateAccion: jest.fn(),
        getAllAcciones: jest.fn(),
    };
    const mockRegistroRepository: jest.Mocked<IRegistroRepository> = {
        registrarAccion: jest.fn(),
        findWeeklyRegistrosWithAccion: jest.fn(),
        findAllWithRelations: jest.fn(),
        countByAccionId: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
    };

    mockClimaService = new ClimaService(mockClimaRepository) as jest.Mocked<ClimaService>;
    mockAccionService = new AccionService(mockAccionRepository, mockRegistroRepository) as jest.Mocked<AccionService>;
    mockRegistroService = new RegistroService(mockRegistroRepository) as jest.Mocked<RegistroService>;

    emailService = new EmailService(mockClimaService, mockAccionService, mockRegistroService);
  });

  it('debería enviar un email de bienvenida', async () => {
    process.env.SENDGRID_API_KEY = 'test-key';
    await emailService.sendWelcomeEmail('test@example.com');
    expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
      to: 'test@example.com',
      subject: 'Bienvenido a la API de Clima',
    }));
  });

  it('debería enviar un resumen semanal', async () => {
    mockRegistroService.getWeeklyRegistrosGroupedByAccion.mockResolvedValue([
      { accionNombre: 'Correr', totalVeces: 5 },
      { accionNombre: 'Nadar', totalVeces: 2 },
    ]);

    await emailService.sendWeeklySummaryEmail('weekly@example.com');

    expect(sgMail.send).toHaveBeenCalled();
    const sentEmail = (sgMail.send as jest.Mock).mock.calls[0][0];
    expect(sentEmail.html).toContain('Correr: 5 veces');
    expect(sentEmail.html).toContain('Nadar: 2 veces');
  });
  
  it('debería manejar un resumen semanal vacío', async () => {
    mockRegistroService.getWeeklyRegistrosGroupedByAccion.mockResolvedValue([]);
    await emailService.sendWeeklySummaryEmail('weekly-empty@example.com');
    expect(sgMail.send).toHaveBeenCalled();
    const sentEmail = (sgMail.send as jest.Mock).mock.calls[0][0];
    expect(sentEmail.html).toContain('No se realizaron acciones esta semana.');
  });

});
