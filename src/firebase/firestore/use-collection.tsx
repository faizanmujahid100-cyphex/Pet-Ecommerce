'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  onSnapshot,
  Query,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { useFirebase } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseCollection<T> {
  data: T[] | null;
  loading: boolean;
  error: FirestoreError | null;
}

function getPathFromQuery(q: Query): string | null {
    if (q instanceof CollectionReference) {
        return q.path;
    }
    // This is a simplified way to get a path-like representation for queries.
    // It might not be perfectly unique for complex queries but works for many cases.
    // @ts-ignore It's a private API but the only way for now.
    return q._path?.canonicalId || null;
}

export function useCollection<T>(q: Query | null): UseCollection<T> {
  const { firestore } = useFirebase();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const queryPath = useMemo(() => q ? getPathFromQuery(q) : null, [q]);


  useEffect(() => {
    if (!firestore || !q) {
      if(!q) setLoading(false);
      return;
    };
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot) => {
        const data = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as unknown as T)
        );
        setData(data);
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        if (queryPath) {
            const permissionError = new FirestorePermissionError({
              path: queryPath,
              operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
        } else {
            console.error("Error fetching collection (path unknown):", err);
        }
        setError(err);
        setLoading(false);
        setData(null);
      }
    );

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, q, queryPath]);

  return { data, loading, error };
}
