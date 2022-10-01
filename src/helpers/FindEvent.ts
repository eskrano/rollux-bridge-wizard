import { TransactionReceipt } from '@ethersproject/abstract-provider';


export const getEvent = (receipt: TransactionReceipt, eventName: string): Array<string> | undefined => {
    // @ts-ignore
    const _events = receipt.events;
    let eventFound: {} | null = null;

    Array.from(_events).forEach((item: any) => {
        if (eventFound === null && item.event === eventName) {
            eventFound = item;
        }
    })

    if (null === eventFound) {
        console.warn(`Event - ${eventName} not found in given receipt.`);

        return undefined;
    }

    return eventFound;
}