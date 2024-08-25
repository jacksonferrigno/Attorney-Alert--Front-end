// attorney-info/floridaBarLookup.ts

export async function lookupFloridaBarMember(barNumber: string, name: string): Promise<any> {
    const response = await fetch(`/api/floridaBarLookup?num=${barNumber}&name=${encodeURIComponent(name)}`);

    if (!response.ok) {
        throw new Error('Failed to fetch Florida Bar information.');
    }

    const data = await response.json(); 
    return data;
}
