import { useState, useEffect } from '@wordpress/element';
import api from '../api';

let cachedData = null;
let loading = false;
let listeners = [];

const dataStore = {
    /**
     * Fetch all data from the API and organize it
     */
    async fetchAll() {
        if (cachedData) return cachedData;
        if (loading) {
            // Wait for existing fetch to complete
            return new Promise((resolve) => {
                listeners.push(resolve);
            });
        }

        loading = true;

        try {
            // Fetch all data in parallel
            const [docSetsResponse, docGroupsResponse, docsResponse] = await Promise.all([
                api.get('doc-sets', { params: { per_page: 100 } }),
                api.get('doc-groups', { params: { per_page: 100 } }),
                api.get('docs', { params: { per_page: 100 } })
            ]);

            const docSets = docSetsResponse?.data?.data?.items || [];
            const docGroups = docGroupsResponse?.data?.data?.items || [];
            const docs = docsResponse?.data?.data?.items || [];

            // Organize data by relationships
            cachedData = {
                docSets,
                docGroups,
                docs,
                // Helper methods to get related data
                getDocSetBySlug(slug) {
                    return docSets.find(ds => ds.slug === slug);
                },
                getDocSetById(id) {
                    return docSets.find(ds => ds.id === id);
                },
                getDocGroupsByDocSetId(docSetId) {
                    return docGroups
                        .filter(dg => dg.doc_set_id === docSetId)
                        .sort((a, b) => (a.position || 0) - (b.position || 0));
                },
                getDocGroupBySlug(slug) {
                    return docGroups.find(dg => dg.slug === slug);
                },
                getDocGroupBySlugAndDocSetId(slug, docSetId) {
                    return docGroups.find(dg => dg.slug === slug && dg.doc_set_id === docSetId);
                },
                getDocGroupById(id) {
                    return docGroups.find(dg => dg.id === id);
                },
                getDocsByDocGroupId(docGroupId) {
                    return docs
                        .filter(d => d.doc_group_id === docGroupId)
                        .sort((a, b) => (a.position || 0) - (b.position || 0));
                },
                getDocBySlug(slug) {
                    return docs.find(d => d.slug === slug);
                },
                getDocBySlugAndDocGroupId(slug, docGroupId) {
                    return docs.find(d => d.slug === slug && d.doc_group_id === docGroupId);
                },
                getDocById(id) {
                    return docs.find(d => d.id === id);
                }
            };

            // Notify all waiting listeners
            listeners.forEach(resolve => resolve(cachedData));
            listeners = [];

            return cachedData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        } finally {
            loading = false;
        }
    },

    /**
     * Clear the cache (useful for refresh)
     */
    clearCache() {
        cachedData = null;
    }
};

/**
 * React hook to use the data store
 */
export function useDataStore() {
    const [data, setData] = useState(cachedData);
    const [isLoading, setIsLoading] = useState(!cachedData);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (cachedData) {
            setData(cachedData);
            setIsLoading(false);
            return;
        }

        dataStore.fetchAll()
            .then(fetchedData => {
                setData(fetchedData);
                setError(null);
            })
            .catch(err => {
                console.error('Error in useDataStore:', err);
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return { data, loading: isLoading, error };
}

export default dataStore;
