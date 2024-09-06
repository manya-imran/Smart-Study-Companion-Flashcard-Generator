// responsible for generating flashcards
"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { Grid, Box, Container, Paper, TextField, Typography, Button, Card, CardActionArea, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { getDoc, collection, writeBatch, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashCards] = useState([])
    const [flipped, setFlipped] = useState({})
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)

    const router = useRouter()

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
        .then((res)=> res.json())
        .then((data) => setFlashCards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }
    const saveFlashcards = async () => {
        if (!name) {
            alert('Enter a name')
            return
        }

        // set the firestore
        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with this name already exists')
                return
            } else {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})   
            }
        } else {
            batch.set(userDocRef, {flashcards : [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
            
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')

    }

    return (
        <Container maxWidth="md">
            <Box 
                sx={{
                    mt:4,
                    mb:6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            
            >
                <Typography variant="h4">Generate Flashcards</Typography>
                <Paper sx={{p:4, width: '100%'}}>
                    <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    label="Enter Text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{mb:2}}>   

                    </TextField>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick = {handleSubmit}
                        fullWidth
                    >
                        {' '}
                        Submit
                    </Button>
                </Paper>
            </Box>
            {flashcards?.length > 0 && (
                <Box sx={{mt:4}}>
                    <Typography variant="h5">
                        Flashcard Preview
                    </Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(index)}>
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
                    <Box sx={{mt:4, display: 'flex', justifyContent: 'center'}}>
                        <Button variant="contained" color="secondary" onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle> Save Flashcard</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please set a name for flashcard collection
                    </DialogContentText>
                    <TextField
                     autoFocus
                     margin="dense"
                     label="Collection Name"
                     type="text"
                     fullWidth
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}