# Workflow Pro - Dashboard Appartement

Ce document décrit le workflow professionnel utilisé pour développer ce dashboard.

## 🎯 Principes

### Le Cerveau vs Les Mains

- **L'humain (Sam)** est le cerveau : il orchestre, décide, valide
- **L'assistant (GLM)** est un cerveau secondaire : il analyse, chunk, délègue
- **Les sub-agents (GLM)** sont les mains : ils implémentent le code

### Workflow de Développement

```
1. Demande utilisateur
       ↓
2. Analyse & Découpage (Assistant)
       ↓
3. Délégation aux sub-agents (Assistant)
       ↓
4. Implémentation (Sub-agents)
       ↓
5. Review & Merge (Humain)
```

## 📋 Règles de Code

### Délégation

**Toute tâche de code > 10 lignes doit être déléguée à un sub-agent.**

**Prompt doit être HYPER PRÉCIS :**
- Spécifier les fichiers à modifier
- Donner des exemples de format
- Indiquer les contraintes techniques
- Découper en étapes claires

### Chunking

**Découper intelligemment :**
- Une tâche = une responsabilité
- Max 5-7 actions par sub-agent
- Diviser les tâches complexes

### Parallélisation

**Quand paralléliser :**
- ✅ Tâches indépendantes
  - HTML structure ↔ CSS styles
  - Data layer ↔ Charts
  - Documentation ↔ Code

- ❌ Tâches dépendantes
  - Logic dépend de HTML structure
  - Formulaire dépend de data layer

## 🔪 Git Workflow

### Branches

**TOUJOURS utiliser des branches `feature/` :**

```bash
# Créer une branche
git checkout -b feature/nom-de-la-feature

# Travailler et committer
git add .
git commit -m "feat: description précise"

# Pusher
git push -u origin feature/nom-de-la-feature

# Créer PR
gh pr create --title "Feature: ..." --body "..."
```

### Types de Commits

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `refactor:` Refactorisation
- `perf:` Performance
- `test:` Tests
- `chore:` Maintenance

### Pull Requests

**Process :**
1. Créer la branche `feature/`
2. Travailler et committer
3. Pusher et créer PR
4. Attendre review
5. Corriger si demandé
6. Merger après approval

**NE JAMAIS :**
- ❌ Pusher directement sur `main`
- ❌ Merger soi-même sans review
- ❌ Sauter l'étape PR

## 🎓 Exemples

### Mauvais Prompt

```
❌ "Ajoute le mode location"
   Trop vague, pas de contexte, pas de contraintes
```

### Bon Prompt

```
✅ "Modifie /home/ubuntu/.openclaw/workspace/appart-dashboard/app.js

OBJECTIF :
Ajouter un sélecteur de mode Achat/Location dans le header

ÉTAPES :
1. Créer switchMode(newMode) qui :
   - Sauvegarde les données actuelles
   - Charge les données du nouveau mode
   - Met à jour l'UI (labels, filtres)

2. Modifier loadData(mode) pour accepter 'achat' ou 'location'
3. Modifier saveData(data, mode) pour sauvegarder selon le mode

CONTRAINTES :
- localStorage : 'appartements_achat' et 'appartements_location'
- Variables globales : currentMode
- Ne pas casser les fonctionnalités existantes

SORTIE :
Code fonctionnel à tester immédiatement"
```

## 📚 Ressources

- **CONTRIBUTING.md** : Guide de contribution complet
- **.github/pull_request_template.md** : Template de PR
- **SKILL pro-coding-workflow** : `/home/ubuntu/.openclaw/workspace/skills/pro-coding-workflow/SKILL.md`

## 🏆 Historique

### PR #1 : Guides de contribution
- Ajout de CONTRIBUTING.md
- Ajout du template de PR
- Mise en place du workflow pro

### Mode Achat/Location
- Sélecteur de mode dans le header
- Données séparées pour chaque mode
- Labels adaptatifs (Prix ↔ Loyer)
- 10 biens de test en achat + 8 en location

---

**Ce workflow garantit un développement professionnel et maintenable.**
