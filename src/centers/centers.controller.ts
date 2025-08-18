import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CentersService } from './centers.service';
import { CreateCenterDto, UpdateCenterDto } from './dto/create-center.dto';

type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

@Controller()
export class CentersController {
  constructor(private readonly service: CentersService) {}

  @MessagePattern('centers.list')
  list(@Payload() p?: { includeInactive?: boolean }) {
    return this.service.list(p?.includeInactive);
  }

  @MessagePattern('centers.get')
  get(@Payload() id: number) {
    return this.service.findById(id);
  }

  @MessagePattern('centers.req.create')
  reqCreate(@Payload() p: { payload: CreateCenterDto; createdBy?: string }) {
    return this.service.requestCreate(p.payload, p.createdBy);
  }

  @MessagePattern('centers.req.update')
  reqUpdate(
    @Payload()
    p: {
      centerId: number;
      payload: UpdateCenterDto;
      createdBy?: string;
    },
  ) {
    return this.service.requestUpdate(p.centerId, p.payload, p.createdBy);
  }

  @MessagePattern('centers.req.delete')
  reqDelete(
    @Payload() p: { centerId: number; reason?: string; createdBy?: string },
  ) {
    return this.service.requestDelete(p.centerId, p.reason, p.createdBy);
  }

  // Listar solicitudes
  @MessagePattern('centers.req.list')
  reqList(@Payload() p?: { status?: RequestStatus }) {
    return this.service.listRequests(p?.status);
  }

  // Aprobar / Rechazar
  @MessagePattern('centers.req.approve')
  approve(
    @Payload()
    p: {
      requestId: number;
      reviewedBy?: string;
      reviewNote?: string;
    },
  ) {
    return this.service.approveRequest(p.requestId, p.reviewedBy, p.reviewNote);
  }

  @MessagePattern('centers.req.reject')
  reject(
    @Payload()
    p: {
      requestId: number;
      reviewedBy?: string;
      reviewNote?: string;
    },
  ) {
    return this.service.rejectRequest(p.requestId, p.reviewedBy, p.reviewNote);
  }
}
