'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"

import { useSearchParams } from "next/navigation"
import { Grid, Box, Container, Paper, TextField, Typography, Button, Card, CardActionArea, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashCards] = useState([])
    const [flipped, setFlipped] = useState({})

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashCard() {
            if (!search || !user) return
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []

           docs.forEach((doc) => {
            flashcards.push({id:doc.id, ...doc.data()})
           })
           setFlashCards(flashcards)
        }
        getFlashCard()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }

    if(!isLoaded || !isSignedIn){
        return <></>
    }

    return(
        <Container maxWidth="100vw">
            <Grid container spacing={3} sx={{mt:4}}>
            {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => 
                                    handleCardClick(index)
                                    }>
                                    <Box
                                        sx={{
                                            perspective: '1000px',
                                            position: 'relative',
                                            width: '100%',
                                            height: '200px',  // Fixed height for the flashcard
                                            overflow: 'hidden',  // Hide overflow outside the card
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            }}
                                        >
                                            {/* Front of the card */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',  // Align content vertically
                                                    justifyContent: 'flex-start',  // Ensure text starts at the top
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                    backfaceVisibility: 'hidden',
                                                    backgroundColor: 'white',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                    textAlign: 'center',
                                                    overflowY: 'auto',  // Make text scrollable
                                                    maxHeight: '100%',
                                                }}
                                            >
                                                <Typography variant="h6">
                                                    {flashcard.front}
                                                </Typography>
                                            </Box>

                                            {/* Back of the card */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',  // Align content vertically
                                                    justifyContent: 'flex-start',  // Ensure text starts at the top
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                    backfaceVisibility: 'hidden',
                                                    transform: 'rotateY(180deg)',
                                                    backgroundColor: 'white',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                    textAlign: 'center',
                                                    overflowY: 'auto',  // Make text scrollable
                                                    maxHeight: '100%',
                                                }}
                                            >
                                                <Typography variant="h6">
                                                    {flashcard.back}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardActionArea>
                            </Card>



                            </Grid>
                        ))}
            </Grid>
        </Container>
    )
}