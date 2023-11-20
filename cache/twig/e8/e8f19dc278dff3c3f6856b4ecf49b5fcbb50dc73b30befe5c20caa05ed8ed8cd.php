<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* @nucleus/content/system.html.twig */
class __TwigTemplate_96389f47f8171335287b40c118d5be19e9abc9a757975a5f9031f88d78c799cf extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 1
        $context["subtype"] = (($this->getAttribute(($context["segment"] ?? null), "subtype", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["segment"] ?? null), "subtype", []), $this->getAttribute(($context["segment"] ?? null), "type", []))) : ($this->getAttribute(($context["segment"] ?? null), "type", [])));
        // line 2
        $context["enabled"] = $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "get", [0 => (("particles." . ($context["subtype"] ?? null)) . ".enabled"), 1 => 1], "method");
        // line 3
        echo "
";
        // line 4
        ob_start();
        // line 5
        echo "    ";
        if ((($context["enabled"] ?? null) && ((null === $this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "enabled", [])) || $this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "enabled", [])))) {
            // line 6
            echo "        ";
            if ((($context["subtype"] ?? null) == "content")) {
                // line 7
                echo "            ";
                $context["class"] = "g-content";
                // line 8
                echo "            ";
                echo ($context["content"] ?? null);
                echo "
        ";
            } elseif ((            // line 9
($context["subtype"] ?? null) == "messages")) {
                // line 10
                echo "            ";
                $context["class"] = "g-system-messages";
                // line 11
                echo "            ";
                echo $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "platform", []), "displaySystemMessages", [], "method");
                echo "
        ";
            }
            // line 13
            echo "    ";
        }
        $context["html"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 15
        echo "
";
        // line 16
        if (twig_trim_filter(($context["html"] ?? null))) {
            // line 17
            echo "    <div class=\"";
            echo twig_escape_filter($this->env, (($context["class"] ?? null) . (($this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "class", [])) ? ((" " . twig_join_filter($this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "class", []), " "))) : (""))), "html", null, true);
            echo "\">
        ";
            // line 18
            echo ($context["html"] ?? null);
            echo "
    </div>
";
        }
    }

    public function getTemplateName()
    {
        return "@nucleus/content/system.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  78 => 18,  73 => 17,  71 => 16,  68 => 15,  64 => 13,  58 => 11,  55 => 10,  53 => 9,  48 => 8,  45 => 7,  42 => 6,  39 => 5,  37 => 4,  34 => 3,  32 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% set subtype = segment.subtype|default(segment.type) %}
{% set enabled = gantry.config.get('particles.' ~ subtype ~ '.enabled', 1) %}

{% set html %}
    {% if enabled and (segment.attributes.enabled is null or segment.attributes.enabled) %}
        {% if subtype == 'content' %}
            {% set class = 'g-content' %}
            {{ content|raw }}
        {% elseif subtype == 'messages' %}
            {% set class = 'g-system-messages' %}
            {{ gantry.platform.displaySystemMessages()|raw }}
        {% endif %}
    {% endif %}
{% endset %}

{% if html|trim %}
    <div class=\"{{ class ~ (segment.attributes.class ? ' ' ~ segment.attributes.class|join(' ')) }}\">
        {{ html|raw }}
    </div>
{% endif %}
", "@nucleus/content/system.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\engines\\nucleus\\templates\\content\\system.html.twig");
    }
}
