# Guide de Contribution

## 📋 Workflow de Développement

### 1. Pour une nouvelle fonctionnalité

```bash
# Créer une branche feature
git checkout -b feature/ma-nouvelle-fonction

# Faire les modifications
# ...

# Committer avec un message clair
git add .
git commit -m "feat: Description de la fonctionnalité"

# Pusher
git push -u origin feature/ma-nouvelle-fonction
```

### 2. Types de commits

Utilisez des préfixes pour vos messages de commit :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation uniquement
- `style:` Style/formatage (pas de changement de code)
- `refactor:` Refactorisation
- `perf:` Amélioration de performance
- `test:` Ajout de tests
- `chore:` Tâche de maintenance

### 3. Créer une Pull Request

```bash
gh pr create \
  --title "Feature: Ma nouvelle fonctionnalité" \
  --body "## Description
Brève description de la fonctionnalité.

## Changements
- Liste des changements

## Tests
- ✅ Test 1
- ✅ Test 2"
```

### 4. Après review et merge

```bash
# Revenir sur main
git checkout main

# Récupérer les changements
git pull

# Supprimer la branche locale
git branch -d feature/ma-nouvelle-fonction
```

## 🔒 Règles

- ✅ **Toujours** travailler sur une branche `feature/`
- ✅ **Toujours** créer une PR avant de merger
- ❌ **JAMAIS** pusher directement sur `main`
- ❌ **JAMAIS** merger sans review (sauf hotfix)

## 📝 Template de PR

```markdown
## Type de changement
- [ ] Nouvelle fonctionnalité
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactorisation
- [ ] Performance
- [ ] Autre

## Description
Description détaillée de ce que la PR change et pourquoi.

## Changements
- Liste des fichiers modifiés
- Liste des fonctionnalités ajoutées/modifiées

## Tests effectués
- [ ] Tests manuels
- [ ] Tests automatiques (si applicable)
- [ ] Capture d'écran (si UI)

## Checklist
- [ ] Code propre et commenté
- [ ] Documentation mise à jour
- [ ] Pas de console errors
- [ ] Compatible navigateurs cibles
```

## 🚨 Hotfixes

Pour une correction urgente en production :

```bash
# Créer une branche hotfix
git checkout -b hotfix/critique-bug

# Correction rapide
# ...

# Commit et push
git add .
git commit -m "hotfix: Description du bug critique"
git push

# PR expédiée pour review rapide
gh pr create --title "Hotfix: Bug critique" --body "Correction urgente"
```
