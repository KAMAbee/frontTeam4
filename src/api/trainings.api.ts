import { PricingType, type Session, type Training } from '../types'
import { API_PATHS } from './config'
import { apiGet, apiPost } from './http'

interface TrainingDto {
    id: string
    supplier: string | null
    title: string
    type: string
    trainer_name: string
    description: string
    pricing_type: string
    price: string | number
    created_at: string
}

interface SessionDto {
    id: string
    training: string
    training_detail?: TrainingDto
    start_date: string
    end_date: string
    location: string
    city: string
    capacity: number
    created_at: string
}

const normalizePricingType = (pricingType: string): PricingType => {
    if (pricingType === PricingType.PER_GROUP) {
        return PricingType.PER_GROUP
    }

    return PricingType.PER_PERSON
}

export interface TrainingEntity extends Training {
    supplierId?: string | null
    trainerName?: string
    description?: string
    createdAt?: string
}

export interface SessionEntity extends Session {
    trainingTitle?: string
    location?: string
    createdAt?: string
}

export interface CreateTrainingPayload {
    supplierId?: string
    title: string
    type: string
    trainerName: string
    description?: string
    pricingType: PricingType
    price: number
}

export interface CreateSessionPayload {
    trainingId: string
    startDate: string
    endDate: string
    location: string
    city: string
    capacity: number
}

export const mapTrainingDto = (training: TrainingDto): TrainingEntity => ({
    id: training.id,
    supplierId: training.supplier,
    title: training.title,
    type: training.type,
    pricingType: normalizePricingType(training.pricing_type),
    price: Number(training.price),
    trainerName: training.trainer_name,
    description: training.description,
    createdAt: training.created_at,
})

export const mapSessionDto = (session: SessionDto): SessionEntity => ({
    id: session.id,
    trainingId: session.training,
    startDate: session.start_date,
    endDate: session.end_date,
    city: session.city,
    capacity: session.capacity,
    location: session.location,
    createdAt: session.created_at,
    trainingTitle: session.training_detail?.title,
})

export const fetchTrainings = async (): Promise<TrainingEntity[]> => {
    const trainings = await apiGet<TrainingDto[]>(API_PATHS.trainings)
    return trainings.map(mapTrainingDto)
}

export const fetchSessions = async (): Promise<SessionEntity[]> => {
    const sessions = await apiGet<SessionDto[]>(API_PATHS.sessions)
    return sessions.map(mapSessionDto)
}

export const createTraining = async (payload: CreateTrainingPayload): Promise<TrainingEntity> => {
    const training = await apiPost<TrainingDto>(API_PATHS.trainings, {
        supplier: payload.supplierId || null,
        title: payload.title,
        type: payload.type,
        trainer_name: payload.trainerName,
        description: payload.description || '',
        pricing_type: payload.pricingType,
        price: payload.price,
    })

    return mapTrainingDto(training)
}

export const createSession = async (payload: CreateSessionPayload): Promise<SessionEntity> => {
    const session = await apiPost<SessionDto>(API_PATHS.sessions, {
        training: payload.trainingId,
        start_date: payload.startDate,
        end_date: payload.endDate,
        location: payload.location,
        city: payload.city,
        capacity: payload.capacity,
    })

    return mapSessionDto(session)
}
