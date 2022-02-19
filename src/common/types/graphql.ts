
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface Comment {
    id: string;
    created: string;
    comment: string;
    author: User;
}

export interface Idea {
    id: string;
    created: string;
    updated: string;
    idea: string;
    description: string;
    author: User;
    upvotes: number;
    downvotes: number;
    comments?: Nullable<Comment[]>;
}

export interface IQuery {
    ideas(page?: Nullable<number>, newest?: Nullable<boolean>): Nullable<Idea[]> | Promise<Nullable<Idea[]>>;
    users(page?: Nullable<number>): Nullable<User[]> | Promise<Nullable<User[]>>;
}

export interface User {
    id: string;
    username: string;
    created: string;
    bookmarks?: Nullable<Idea[]>;
    ideas?: Nullable<Idea[]>;
    comments?: Nullable<Nullable<Comment>[]>;
}

type Nullable<T> = T | null;
