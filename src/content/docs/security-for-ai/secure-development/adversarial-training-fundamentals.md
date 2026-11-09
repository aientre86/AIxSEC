---
title: "Adversarial Training & Robustness Fundamentals"
description: "Foundational techniques for hardening neural networks and embedding layers against adversarial perturbations and data poisoning."
pillar: "DD"
tags: ["Adversarial-Robustness", "Model-Hardening", "Data-Poisoning", "Evaluation"]
threat_level: "High"
date: 2026-03-31
draft: false
---

## Overview

Modern deep neural networks, including large transformers, are inherently vulnerable to small, deliberate input perturbations known as **adversarial examples**. In vision systems, imperceptible noise can cause misclassification; in NLP and generative AI, token-level perturbations or poisoned training corpora can subvert model safety boundaries or induce targeted backdoor activations.

---

## Adversarial Attacks Taxonomy

### 1. Evasion Attacks (Inference Phase)
Adversarial noise designed to cross decision boundaries during runtime:
- **FGSM (Fast Gradient Sign Method):** Single-step perturbation along the sign of the loss gradient:
  $$\eta = \epsilon \cdot \text{sign}(\nabla_x \mathcal{L}(\theta, x, y))$$
- **PGD (Projected Gradient Descent):** Iterative gradient updates clipped within an $L_\infty$ or $L_2$ norm ball $\mathcal{S}$:
  $$x^{t+1} = \Pi_{x + \mathcal{S}} \left( x^t + \alpha \cdot \text{sign}(\nabla_x \mathcal{L}(\theta, x^t, y)) \right)$$

### 2. Poisoning & Backdoor Attacks (Training Phase)
- **Data Poisoning:** Injecting contaminated samples into training corpora to degrade overall test accuracy or introduce targeted vulnerabilities.
- **Trojan / Backdoor Activation:** Embedding latent triggers (e.g., a specific rare unicode sequence or watermark pattern) that force a predetermined malicious output while maintaining nominal accuracy on benign benchmarks.

---

## Defense Strategies: Min-Max Adversarial Hardening

Adversarial Training formulates robust optimization as a saddle-point problem:

$$\min_{\theta} \mathbb{E}_{(x, y) \sim \mathcal{D}} \left[ \max_{\delta \in \Delta} \mathcal{L}(\theta, x + \delta, y) \right]$$

### Key Implementation Principles

1. **Inner Maximization:** Generate the most damaging perturbation $\delta$ within the allowable perturbation budget $\Delta$ using multi-step PGD or discrete token substitution.
2. **Outer Minimization:** Update the model parameters $\theta$ to minimize loss on the generated adversarial samples.
3. **Certified Robustness:** In critical domains, leverage randomized smoothing or interval bound propagation (IBP) to provide provable guarantees on prediction stability.
4. **Data Sanitization Pipelines:** Apply anomaly detection, perplexity filtering, and influence function scoring to strip contaminated samples from fine-tuning datasets.
