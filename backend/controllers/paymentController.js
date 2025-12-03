exports.uploadProof = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a payment proof image' });
        }

        // Return the file path so the frontend can use it
        // The path should be relative to the server root or a full URL
        // For now, we return the relative path that can be used with the static file server
        const proofUrl = `/uploads/proofs/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'Payment proof uploaded successfully',
            proofUrl: proofUrl
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};
