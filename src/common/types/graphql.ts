
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
}

export interface IQuery {
    comment(commentId: string): Nullable<Comment> | Promise<Nullable<Comment>>;
    idea(ideaId: string): Idea | Promise<Idea>;
    ideas(page?: Nullable<number>, newest?: Nullable<boolean>): Nullable<Idea[]> | Promise<Nullable<Idea[]>>;
    users(page?: Nullable<number>): Nullable<User[]> | Promise<Nullable<User[]>>;
    user(username: string): User | Promise<User>;
    whoami(): Nullable<User> | Promise<Nullable<User>>;
}

export interface IMutation {
    createComment(ideaId: string, comment: string): Nullable<Comment> | Promise<Nullable<Comment>>;
    deleteComment(commentId: string): Nullable<Comment> | Promise<Nullable<Comment>>;
    createIdea(idea: string, description: string): Idea | Promise<Idea>;
    updateIdea(ideaId: string, idea?: Nullable<string>, description?: Nullable<string>): Idea | Promise<Idea>;
    deleteIdea(ideaId: string): Idea | Promise<Idea>;
    upvote(ideaId: string): Idea | Promise<Idea>;
    downvote(ideaId: string): Idea | Promise<Idea>;
    bookmark(ideaId: string): User | Promise<User>;
    unBookmark(ideaId: string): User | Promise<User>;
    login(username: string, password: string): Nullable<Auth> | Promise<Nullable<Auth>>;
    register(username: string, password: string): Nullable<Auth> | Promise<Nullable<Auth>>;
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

export interface User {
    id: string;
    username: string;
    created: string;
    bookmarks?: Nullable<Idea[]>;
    ideas?: Nullable<Idea[]>;
    comments?: Nullable<Nullable<Comment>[]>;
}

export interface Auth {
    token: string;
    username: string;
}

type Nullable<T> = T | null;
