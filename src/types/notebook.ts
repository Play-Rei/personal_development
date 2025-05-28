import { Timestamp } from "firebase/firestore";

export type Notebook = {
    id: string;
    title: string;
    contentPath: string;
    updatedAt: Timestamp;
    createdAt: Timestamp;
    isArchived: boolean;
};