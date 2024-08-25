import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export const runtime = 'nodejs'; // Use this instead of the deprecated config

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const barNumber = searchParams.get('num');
    const providedName = searchParams.get('name');

    if (!barNumber || !providedName) {
        return NextResponse.json({ error: "Bar number and name are required" }, { status: 400 });
    }

    const url = `https://www.floridabar.org/directories/find-mbr/profile/?num=${barNumber}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'DNT': '1', // Do Not Track
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch data from Florida Bar", response.statusText);
            return NextResponse.json({ error: "Failed to fetch data from Florida Bar" }, { status: response.status });
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract name, status, and eligibility
        const extractedName = $('h1.full').text().trim();
        const status = $('.member-status').text().trim();
        const eligibility = $('.eligibility').text().trim();

        // Log the parsed information
        console.log("Extracted Name:", extractedName);
        console.log("Status:", status);
        console.log("Eligibility:", eligibility);

        // Normalize names: remove middle initials and extra spaces
        const normalizeName = (name: string) => name.toLowerCase().replace(/\b\w\b/g, '').replace(/\s+/g, ' ').trim();
        const normalizedProvidedName = normalizeName(providedName);
        const normalizedExtractedName = normalizeName(extractedName);

        // Verify name similarity after normalization
        const namesMatch = normalizedExtractedName.includes(normalizedProvidedName);

        // Check if the attorney is in good standing and eligible to practice
        const inGoodStanding = status.includes('Good Standing');
        const isEligible = eligibility.includes('Eligible to Practice Law');

        if (namesMatch && inGoodStanding && isEligible) {
            return NextResponse.json({
                success: true,
                name: extractedName,
                status: status,
                eligibility: eligibility,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "The attorney's name did not match, or they are not in good standing or eligible to practice.",
            });
        }

    } catch (error) {
        console.error("An error occurred while fetching data", error);
        return NextResponse.json({ error: "An error occurred while fetching data" }, { status: 500 });
    }
}
