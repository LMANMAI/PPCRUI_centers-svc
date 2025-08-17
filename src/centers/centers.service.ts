import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCenterDto, UpdateCenterDto } from './dto/create-center.dto';

type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type RequestType = 'CREATE' | 'UPDATE' | 'DELETE';

// ---------- type guards ----------
const isCreateCenterDto = (x: any): x is CreateCenterDto =>
  x &&
  typeof x === 'object' &&
  typeof x.name === 'string' &&
  typeof x.address === 'string';

const isUpdateCenterDto = (x: any): x is UpdateCenterDto =>
  x && typeof x === 'object';

function toCreateData(dto: CreateCenterDto) {
  return {
    // obligatorios
    name: dto.name,
    address: dto.address,
    zone: dto.zone ?? null,
    capacity: dto.capacity ?? null,
    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
    description: dto.description ?? null,
    phone: dto.phone ?? null,
    email: dto.email ?? null,
    startDay: dto.startDay ?? null,
    endDay: dto.endDay ?? null,
    openTime: dto.openTime ?? null,
    closeTime: dto.closeTime ?? null,
    respFullName: dto.respFullName ?? null,
    respPhone: dto.respPhone ?? null,
    respLicense: dto.respLicense ?? null,
    status: 'ACTIVE' as const,
  };
}

function toUpdateData(dto: UpdateCenterDto) {
  const data: Record<string, any> = {};
  if (dto.name !== undefined) data.name = dto.name;
  if (dto.address !== undefined) data.address = dto.address;
  if (dto.zone !== undefined) data.zone = dto.zone ?? null;
  if (dto.capacity !== undefined) data.capacity = dto.capacity ?? null;
  if (dto.latitude !== undefined) data.latitude = dto.latitude ?? null;
  if (dto.longitude !== undefined) data.longitude = dto.longitude ?? null;
  if (dto.description !== undefined) data.description = dto.description ?? null;
  if (dto.phone !== undefined) data.phone = dto.phone ?? null;
  if (dto.email !== undefined) data.email = dto.email ?? null;
  if (dto.startDay !== undefined) data.startDay = dto.startDay ?? null;
  if (dto.endDay !== undefined) data.endDay = dto.endDay ?? null;
  if (dto.openTime !== undefined) data.openTime = dto.openTime ?? null;
  if (dto.closeTime !== undefined) data.closeTime = dto.closeTime ?? null;
  if (dto.respFullName !== undefined)
    data.respFullName = dto.respFullName ?? null;
  if (dto.respPhone !== undefined) data.respPhone = dto.respPhone ?? null;
  if (dto.respLicense !== undefined) data.respLicense = dto.respLicense ?? null;
  return data;
}

@Injectable()
export class CentersService {
  constructor(private prisma: PrismaService) {}

  list(includeInactive = false) {
    return this.prisma.center.findMany({
      where: includeInactive ? {} : { status: 'ACTIVE' },
      orderBy: { id: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.center.findUnique({ where: { id } });
  }

  async requestCreate(payload: CreateCenterDto, createdBy?: string) {
    return this.prisma.centerRequest.create({
      data: {
        type: 'CREATE',
        payload: payload as any,
        createdBy,
      },
    });
  }

  async requestUpdate(
    centerId: number,
    payload: UpdateCenterDto,
    createdBy?: string,
  ) {
    return this.prisma.centerRequest.create({
      data: {
        type: 'UPDATE',
        centerId,
        payload: payload as any,
        createdBy,
      },
    });
  }

  async requestDelete(centerId: number, reason?: string, createdBy?: string) {
    return this.prisma.centerRequest.create({
      data: {
        type: 'DELETE',
        centerId,
        payload: {},
        reason,
        createdBy,
      },
    });
  }

  listRequests(status?: RequestStatus) {
    return this.prisma.centerRequest.findMany({
      where: status ? { status } : {},
      orderBy: { id: 'desc' },
    });
  }

  async approveRequest(
    requestId: number,
    reviewedBy?: string,
    reviewNote?: string,
  ) {
    const req = await this.prisma.centerRequest.findUnique({
      where: { id: requestId },
    });
    if (!req) throw new Error('Solicitud inexistente');
    if (req.status !== 'PENDING')
      throw new Error('La solicitud no está pendiente');

    if (req.type === 'CREATE') {
      const raw = (req.payload ?? {}) as unknown; // cast intermedio
      if (!isCreateCenterDto(raw)) {
        throw new Error('Payload inválido: name y address son requeridos');
      }
      const created = await this.prisma.center.create({
        data: toCreateData(raw),
      });
      return this.prisma.centerRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          reviewedBy,
          reviewNote,
          appliedAt: new Date(),
          centerId: created.id,
        },
      });
    }

    if (req.type === 'UPDATE') {
      if (!req.centerId) throw new Error('centerId requerido');
      const raw = (req.payload ?? {}) as unknown; // cast intermedio
      if (!isUpdateCenterDto(raw)) {
        throw new Error('Payload inválido para UPDATE');
      }
      await this.prisma.center.update({
        where: { id: req.centerId },
        data: toUpdateData(raw),
      });
      return this.prisma.centerRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          reviewedBy,
          reviewNote,
          appliedAt: new Date(),
        },
      });
    }

    if (req.type === 'DELETE') {
      if (!req.centerId) throw new Error('centerId requerido');
      await this.prisma.center.update({
        where: { id: req.centerId },
        data: { status: 'INACTIVE' }, // soft delete
      });
      return this.prisma.centerRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          reviewedBy,
          reviewNote,
          appliedAt: new Date(),
        },
      });
    }

    throw new Error(
      `Tipo de solicitud no soportado: ${req.type as RequestType}`,
    );
  }

  rejectRequest(requestId: number, reviewedBy?: string, reviewNote?: string) {
    return this.prisma.centerRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED', reviewedBy, reviewNote },
    });
  }
}
