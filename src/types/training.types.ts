export type PricingType = 'PER_PERSON' | 'PER_GROUP';

export const PricingType = {
    PER_PERSON: 'PER_PERSON' as const,
    PER_GROUP: 'PER_GROUP' as const,
};

export interface Training {
    id: string
    title: string
    type: string
    pricingType: PricingType
    price: number
}

export interface Session {
    id: string
    trainingId: string
    startDate: string
    endDate: string
    city: string
    capacity: number
}
