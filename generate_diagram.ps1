Add-Type -AssemblyName System.Drawing

$width = 1350
$height = 920
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# Couleurs
$cBg = [System.Drawing.Color]::FromArgb(250, 247, 242)        # #FAF7F2 Crème
$cGreen = [System.Drawing.Color]::FromArgb(43, 71, 54)        # #2B4736 Vert sapin
$cGold = [System.Drawing.Color]::FromArgb(195, 157, 94)       # #C39D5E Or
$cDark = [System.Drawing.Color]::FromArgb(31, 41, 34)         # #1F2922
$cCardBg = [System.Drawing.Color]::White
$cBorder = [System.Drawing.Color]::FromArgb(220, 214, 202)
$cMoncash = [System.Drawing.Color]::FromArgb(196, 18, 48)
$cStripe = [System.Drawing.Color]::FromArgb(99, 91, 255)
$cWhatsApp = [System.Drawing.Color]::FromArgb(37, 211, 102)

# Fond
$g.Clear($cBg)

# Polices
$fTitle = New-Object System.Drawing.Font("Georgia", 20, [System.Drawing.FontStyle]::Bold)
$fSubtitle = New-Object System.Drawing.Font("Calibri", 11, [System.Drawing.FontStyle]::Italic)
$fLane = New-Object System.Drawing.Font("Georgia", 11, [System.Drawing.FontStyle]::Bold)
$fStepNum = New-Object System.Drawing.Font("Calibri", 9, [System.Drawing.FontStyle]::Bold)
$fCardTitle = New-Object System.Drawing.Font("Calibri", 10.5, [System.Drawing.FontStyle]::Bold)
$fCardText = New-Object System.Drawing.Font("Calibri", 9)
$fArrow = New-Object System.Drawing.Font("Calibri", 9, [System.Drawing.FontStyle]::Bold)

# Brosses et Stylos
$bDark = New-Object System.Drawing.SolidBrush($cDark)
$bGreen = New-Object System.Drawing.SolidBrush($cGreen)
$bGold = New-Object System.Drawing.SolidBrush($cGold)
$bWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$bGray = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 95, 90))
$pBorder = New-Object System.Drawing.Pen($cBorder, 1.5)
$pGreen = New-Object System.Drawing.Pen($cGreen, 2)
$pGold = New-Object System.Drawing.Pen($cGold, 2)
$pArrow = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 115, 110), 2)
$pArrow.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(5, 5)

# 1. En-tête
$rectHeader = New-Object System.Drawing.Rectangle(40, 25, 1270, 75)
$bHeader = New-Object System.Drawing.SolidBrush($cGreen)
$g.FillRectangle($bHeader, $rectHeader)
$g.DrawString("KATDIGITAL • SCHÉMA DU FLUX TECHNIQUE GLOBAL", $fTitle, $bWhite, 65, 38)
$g.DrawString("Architecture Guest Checkout (sans mot de passe) • Supabase (DB + Edge Functions) • MonCash (100 HTG) & Stripe ($2.99)", $fSubtitle, (New-Object System.Drawing.SolidBrush($cGold)), 65, 70)

# Fonction pour dessiner un bloc d'étape
function Draw-StepBox($x, $y, $w, $h, $num, $title, $desc, $accentBrush, $badgeText) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($cCardBg)), $rect)
    $g.DrawRectangle($pBorder, $rect)

    # Barre d'accentuation en haut
    $g.FillRectangle($accentBrush, $x, $y, $w, 5)

    # Badge numéro
    $badgeRect = New-Object System.Drawing.Rectangle(($x + 10), ($y + 12), 24, 20)
    $g.FillRectangle($accentBrush, $badgeRect)
    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString($num, $fStepNum, $bWhite, [System.Drawing.RectangleF]::op_Implicit($badgeRect), $sfCenter)

    # Titre
    $g.DrawString($title, $fCardTitle, $bDark, ($x + 40), ($y + 12))

    # Badge secondaire
    if ($badgeText) {
        $g.DrawString($badgeText, $fStepNum, (New-Object System.Drawing.SolidBrush($cGold)), ($x + 10), ($y + 36))
    }

    # Description
    $textRect = New-Object System.Drawing.RectangleF(($x + 10), ($y + 52), ($w - 20), ($h - 56))
    $g.DrawString($desc, $fCardText, $bGray, $textRect)
}

# 4 COLONNES (SWIMLANES)
$colWidth = 295
$gap = 30
$startY = 120

$col1X = 40
$col2X = $col1X + $colWidth + $gap
$col3X = $col2X + $colWidth + $gap
$col4X = $col3X + $colWidth + $gap

# Dessiner les en-têtes de colonnes
function Draw-ColHeader($x, $w, $title, $sub, $color) {
    $rect = New-Object System.Drawing.Rectangle($x, $startY, $w, 50)
    $g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(242, 237, 228))), $rect)
    $g.DrawRectangle($pBorder, $rect)
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($color)), $x, $startY, $w, 4)
    $g.DrawString($title, $fLane, (New-Object System.Drawing.SolidBrush($color)), ($x + 12), ($startY + 10))
    $g.DrawString($sub, $fCardText, $bGray, ($x + 12), ($startY + 28))
}

Draw-ColHeader $col1X $colWidth "1. CLIENT (FRONT-END)" "Vite + React (Guest Checkout)" $cGreen
Draw-ColHeader $col2X $colWidth "2. PAIEMENT & SÉCURITÉ" "MonCash (HTG) / Stripe (USD)" $cMoncash
Draw-ColHeader $col3X $colWidth "3. SUPABASE BACK-END" "Database + Edge Functions" $cGreen
Draw-ColHeader $col4X $colWidth "4. DESTINATAIRE & VIRALITÉ" "WhatsApp & Boucle d'acquisition" $cWhatsApp

# --- COLONNE 1 : ÉTAPES CLIENT ---
Draw-StepBox $col1X ($startY + 65) $colWidth 90 "1" "Navigation & Démo" "Le client visite katdigital.ht sans compte. Il teste l'ouverture 3D de l'enveloppe avec musique." $bGreen "ACCÈS IMMÉDIAT"

Draw-StepBox $col1X ($startY + 180) $colWidth 95 "2" "Personnalisation en direct" "Il tape le nom (Vanessa), son nom (David) et choisit un message. Aperçu temps réel instantané." $bGreen "ZÉRO LATENCE"

Draw-StepBox $col1X ($startY + 300) $colWidth 100 "3" "Clic Partage -> PAYWALL" "En cliquant sur 'Pataje sou WhatsApp', la modale s'ouvre : 'Debloke pou 100 Goud'." $bGold "EFFET D'ATTACHEMENT"

# --- COLONNE 2 : CHOIX & PAIEMENT ---
Draw-StepBox $col2X ($startY + 300) $colWidth 100 "4" "Sélection du Moyen de Paiement" "A) MonCash : 100 HTG (Digicel Haïti)`nB) Carte Bancaire : 2.99 $ USD (Stripe pour la Diaspora)" (New-Object System.Drawing.SolidBrush($cMoncash)) "MULTI-DEVISES"

Draw-StepBox $col2X ($startY + 430) $colWidth 95 "5" "Validation Client" "• MonCash : validation via code PIN.`n• Stripe : saisie sécurisée de carte sur le formulaire hébergé." (New-Object System.Drawing.SolidBrush($cStripe)) "TRANSACTION SÉCURISÉE"

# --- COLONNE 3 : SUPABASE BACK-END ---
Draw-StepBox $col3X ($startY + 300) $colWidth 100 "6" "POST /orders/create" "Supabase Edge Function insère la commande dans 'orders' avec statut 'PENDING'." $bGreen "TABLE 'orders'"

Draw-StepBox $col3X ($startY + 430) $colWidth 100 "7" "Notification Webhook" "Digicel ou Stripe envoie un webhook signé certifiant le règlement réussi." $bGold "SÉCURITÉ HMAC"

Draw-StepBox $col3X ($startY + 560) $colWidth 115 "8" "Activation de la Carte" "1. orders.payment_status = 'PAID'`n2. Génération du slug unique (ex: 'x7K9p2')`n3. Insertion dans la table 'cards'`n4. Déblocage du lien public" $bGreen "TABLE 'cards' UNIQUE"

# --- COLONNE 1 (SUITE) : DÉBLOCAGE ---
Draw-StepBox $col1X ($startY + 560) $colWidth 115 "9" "Écran de Victoire (Succès)" "Le client reçoit son lien officiel débloqué :`n• Bouton direct WhatsApp (wa.me/?text=...)`n• Bouton Télécharger Carte (PNG pour statut)" $bGold "DÉBLOCAGE INSTANTANÉ"

# --- COLONNE 4 : DESTINATAIRE & VIRALITÉ ---
Draw-StepBox $col4X ($startY + 560) $colWidth 115 "10" "Réception sur WhatsApp" "Vanessa reçoit le lien personnalisé. En cliquant, elle découvre l'enveloppe 3D avec son prénom." (New-Object System.Drawing.SolidBrush($cWhatsApp)) "EFFET WAOUH"

Draw-StepBox $col4X ($startY + 705) $colWidth 115 "11" "BOUCLE DE VIRALITÉ" "Au bas de la carte de Vanessa :`n👉 'Ou renmen kat sa a? Kreye pa w la tou pou 100 Goud'`nChaque carte génère 5 à 10 nouveaux clients !" $bGold "PUB GRATUITE"

# FLÈCHES DE FLUX
# 1 -> 2
$g.DrawLine($pArrow, ($col1X + 147), ($startY + 155), ($col1X + 147), ($startY + 180))
# 2 -> 3
$g.DrawLine($pArrow, ($col1X + 147), ($startY + 275), ($col1X + 147), ($startY + 300))
# 3 -> 4
$g.DrawLine($pArrow, ($col1X + $colWidth), ($startY + 350), $col2X, ($startY + 350))
# 4 -> 6
$g.DrawLine($pArrow, ($col2X + $colWidth), ($startY + 350), $col3X, ($startY + 350))
# 4 -> 5
$g.DrawLine($pArrow, ($col2X + 147), ($startY + 400), ($col2X + 147), ($startY + 430))
# 5 -> 7
$g.DrawLine($pArrow, ($col2X + $colWidth), ($startY + 480), $col3X, ($startY + 480))
# 7 -> 8
$g.DrawLine($pArrow, ($col3X + 147), ($startY + 530), ($col3X + 147), ($startY + 560))
# 8 -> 9 (Retour au client)
$g.DrawLine($pArrow, $col3X, ($startY + 610), ($col1X + $colWidth), ($startY + 610))
# 9 -> 10 (Partage vers destinataire)
$pWhatsAppArrow = New-Object System.Drawing.Pen($cWhatsApp, 2.5)
$pWhatsAppArrow.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(5, 5)
$g.DrawLine($pWhatsAppArrow, ($col1X + 200), ($startY + 675), ($col4X + 50), ($startY + 675))
# 10 -> 11
$g.DrawLine($pArrow, ($col4X + 147), ($startY + 675), ($col4X + 147), ($startY + 705))
# 11 -> Boucle vers 1 (Retour au sommet)
$pLoop = New-Object System.Drawing.Pen($cGold, 2)
$pLoop.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
$pLoop.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(5, 5)
$pts = @(
    (New-Object System.Drawing.Point(($col4X + 270), ($startY + 760))),
    (New-Object System.Drawing.Point(1325, ($startY + 760))),
    (New-Object System.Drawing.Point(1325, 95)),
    (New-Object System.Drawing.Point(($col1X + 147), 95)),
    (New-Object System.Drawing.Point(($col1X + 147), ($startY + 65)))
)
$g.DrawLines($pLoop, $pts)
$g.DrawString("BOUCLE VIRALE : 1 CARTE ENVOYÉE = 5 À 10 NOUVEAUX CLIENTS", $fStepNum, (New-Object System.Drawing.SolidBrush($cGold)), 800, 102)

# Sauvegarde
$outputPath = "C:\Users\wangu\Desktop\katdijital\schema_flux_katdigital.png"
$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "Image du flux générée avec succès : $outputPath"
